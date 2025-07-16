import uuid
from django.db import models

class Tickets(models.Model):
    ticket_id = models.CharField(max_length=255, unique=True)
    workflow = models.ForeignKey('workflow.Workflows', to_field="workflow_id", on_delete=models.CASCADE)
    category = models.CharField(max_length=255)
    sub_category = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    priority = models.CharField(max_length=255)
    status = models.CharField(max_length=255)

    class Meta:
        db_table = "tickets"

# function to assign a ticket to a workflow


# function/signal to create assign a workflow when a ticket is created