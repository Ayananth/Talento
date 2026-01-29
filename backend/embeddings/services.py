from openai import OpenAI
import os

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
