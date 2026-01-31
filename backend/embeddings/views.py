from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from jobs.models.job import Job
from embeddings.models import JobEmbedding
from embeddings.services import generate_embedding, build_job_text



from django.db.models import F, FloatField, ExpressionWrapper
from pgvector.django import CosineDistance
import logging
logger = logging.getLogger(__name__)





class SemanticJobSearchAPIView(APIView):

    def post(self, request):
        query_text = request.data["query"]
        logger.info(f"{query_text=}")

        query_vector = generate_embedding(query_text)

        logger.info(f"{query_vector=}")

        

        matches = (
            JobEmbedding.objects
            .annotate(
                distance=CosineDistance("embedding", query_vector),
                similarity=ExpressionWrapper(
                    1 - CosineDistance("embedding", query_vector),
                    output_field=FloatField()
                ),
            )
            .order_by("-similarity")[:10]
        )

        logger.info(f"{matches=}")



        results = [
            {
                "match_percent": round(m.similarity * 100, 2),
            }
            for m in matches
        ]

        return Response({"results": results})


class JobCreateWithEmbeddingAPIView(APIView):

    def post(self, request):
        data = request.data

        # job = Job.objects.create(
        #     title=data["title"],
        #     company=data["company"],
        #     description=data["description"],
        #     skills=data["skills"],
        #     experience_years=data["experience_years"],
        # )

        job_text = build_job_text()
        logger.info(f"{job_text=}")

        embedding = generate_embedding(job_text)
        logger.info(f"{embedding=}")


        JobEmbedding.objects.create(
            embedding=embedding
        )

        return Response(
            {"job_id": "None", "status": "created with embedding"},
            status=status.HTTP_201_CREATED
        )
