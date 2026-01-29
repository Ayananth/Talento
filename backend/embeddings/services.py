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


def build_job_text(job=None):


    return """
  "title": "Backend Python Developer",
  "company": "Talento Labs",
  "description": "Build scalable APIs using Django and PostgreSQL",
  "skills": "Python, Django, AWS, Redis",
  "experience_years": 3
"""





    return f"""
    Job Title: {job.title}
    Company: {job.company}
    Skills: {job.skills}
    Experience: {job.experience_years} years
    Description: {job.description}
    """
