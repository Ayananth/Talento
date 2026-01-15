from django.template.loader import render_to_string


def render_email(template_name, context):
    """
    Renders text and HTML email templates.
    """

    text_body = render_to_string(
        f"emails/{template_name}.txt",
        context,
    )

    html_body = render_to_string(
        f"emails/{template_name}.html",
        context,
    )

    return text_body, html_body
