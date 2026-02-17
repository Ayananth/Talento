from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("applications", "0008_jobapplication_applied_resume"),
    ]

    operations = [
        migrations.AddField(
            model_name="jobapplication",
            name="parsed_data_snapshot",
            field=models.JSONField(
                blank=True,
                help_text="Editable parsed resume data snapshot submitted at application time",
                null=True,
            ),
        ),
    ]

