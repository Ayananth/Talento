import os
import json
import re
import logging
from openai import OpenAI
import fitz  # PyMuPDF
import re

logger = logging.getLogger(__name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def extract_json_from_text(text: str) -> dict:
    """
    Extracts the first valid JSON object from AI output safely.
    Handles code blocks, language tags, and extra text.
    """

    match = re.search(r"\{.*\}", text, re.DOTALL)

    if not match:
        raise ValueError(f"No JSON found in AI output:\n{text}")

    json_str = match.group(0)

    return json.loads(json_str)


def parse_resume_with_ai(resume_text: str) -> dict:
    """
    Sends resume text to AI and returns structured resume data safely.
    """

    prompt = f"""
You are an AI resume parser for a job matching platform.

Extract the following in valid JSON:

{{
  "role": "current or desired job title",
  "skills": ["list", "of", "technical", "skills"],
  "experience_summary": "2–3 sentence professional summary",
  "education": "highest relevant education",
  "experience_level": "fresher | mid | senior",
  "projects_summary": "brief summary of key projects (if any)"
}}

Rules:
- Skills must be technical only
- No soft skills
- If missing return null
- Return JSON only

Resume text:
\"\"\"{resume_text}\"\"\"
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    raw_output = response.output_text.strip()

    logger.info(f"AI resume output:\n{raw_output}")

    return extract_json_from_text(raw_output)


def clean_resume_text(text: str) -> str:
    """
    Basic cleanup for AI parsing & embeddings
    """

    # remove excessive whitespace
    text = re.sub(r"\s+", " ", text)

    # remove weird non-printable chars
    text = re.sub(r"[^\x20-\x7E]", " ", text)

    return text.strip()




def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts readable text from a PDF resume.
    Works well with most resume layouts.
    """

    doc = fitz.open(file_path)

    text_parts = []

    for page in doc:
        page_text = page.get_text("text")
        text_parts.append(page_text)

    raw_text = "\n".join(text_parts)

    return clean_resume_text(raw_text)


def build_candidate_text(parsed: dict) -> str:
    """
    Converts parsed resume JSON into semantic text for embeddings.
    """

    role = parsed.get("role") or ""
    skills = parsed.get("skills") or []
    experience = parsed.get("experience_summary") or ""
    education = parsed.get("education") or ""
    level = parsed.get("experience_level") or ""
    projects = parsed.get("projects_summary") or ""

    skills_text = ", ".join(skills)

    return f"""
    Experience Level: {level}
    Skills: {skills_text}
    Professional Experience: {experience}
    """.strip()
