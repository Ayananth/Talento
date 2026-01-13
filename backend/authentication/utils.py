from rest_framework_simplejwt.tokens import AccessToken

def generate_email_verification_token(user):
    token = AccessToken.for_user(user)
    token["email_verification"] = True
    token["role"] = user.role
    return str(token)
