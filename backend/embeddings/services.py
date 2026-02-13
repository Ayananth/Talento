from openai import OpenAI
import os
import json
import logging
logger = logging.getLogger(__name__)


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

EMBED_MODEL = "text-embedding-3-small"  # fast + cheap (1536 dims)


def generate_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        model=EMBED_MODEL,
        input=text
    )
    return response.data[0].embedding


def build_job_text(job):

    if not job:
        return ""

    skills = ", ".join(
        job.skills.values_list("name", flat=True)
    )

    return f"""
    Job Title: {job.title}
    Skills: {skills}
    Description: {job.description}
    """


import json
import re


def clean_json_output(text: str) -> str:
    """
    Removes ```json ... ``` or ``` ... ``` wrappers if present
    """
    text = text.strip()

    # Remove ```json and ``` wrappers
    if text.startswith("```"):
        text = re.sub(r"^```json\s*", "", text)
        text = re.sub(r"^```\s*", "", text)
        text = re.sub(r"\s*```$", "", text)

    return text.strip()


def generate_application_insight(job, resume_data):

    prompt = f"""
You are an AI hiring assistant.

Compare this job and candidate.

JOB:
Title: {job.title}
Skills: {[s.name for s in job.skills.all()]}
Experience Level: {job.experience_level}
Description: {job.description}

CANDIDATE:
Role: {resume_data["role"]}
Skills: {resume_data["skills"]}
Summary: {resume_data["experience_summary"]}

Return ONLY valid JSON:
{{
  "strengths": ["list strong matches"],
  "gaps": ["missing or weak areas"],
  "summary": "2–3 sentence hiring assessment"
}}
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )

    raw = response.output_text.strip()
    logger.info(f"AI raw insight output: {raw}")

    cleaned = clean_json_output(raw)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse insight JSON:\n{cleaned}")
        raise ValueError("Invalid JSON returned by AI")
