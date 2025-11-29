from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view #for FBV, remove if not used
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

class SignUpView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User created successfully"
            }, status = status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class MyTokenObtainPairView(TokenObtainPairView):
    print("Login request received")
    serializer_class = MyTokenObtainPairSerializer



class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"})
        except Exception:
            return Response({"error": "Invalid token"}, status=400)






# @api_view(['POST'])
# def SignUpView(request):
#     # Deserialize the incoming data using the UserSerializer
#     serializer = UserSerializer(data=request.data)
    
#     # Validate the data
#     if serializer.is_valid():
#         try:
#             # Create the user
#             user = serializer.save()

#             # Return a success response
#             return Response({
#                 "message": "User created successfully.",
#                 "user": {
#                     "email": user.email
#                 }
#             }, status=status.HTTP_201_CREATED)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
#     else:
#         # If validation fails, return errors
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from django.http import HttpResponse

def test(request):
    return HttpResponse("Hello, World!", content_type="text/plain")



    
