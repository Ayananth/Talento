import uuid
import cloudinary.uploader


def upload_chat_file_to_cloudinary(file, chat_id):
    public_id = f"chat_attachments/{chat_id}/{uuid.uuid4()}"

    result = cloudinary.uploader.upload(
        file,
        public_id=public_id,
        resource_type="auto",
    )

    return {
        "file_url": result["secure_url"],
        "file_name": file.name,
        "file_type": file.content_type,
        "file_size": result["bytes"],
        "public_id": result["public_id"],
    }
