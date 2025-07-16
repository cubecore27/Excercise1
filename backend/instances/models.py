import uuid
from django.db import models

class Step_Instances(models.Model):
    step_instance_id = models.UUIDField(default=uuid.uuid4, unique=True)
    user_id = models.UUIDField(default=uuid.uuid4)
    step_id = models.ForeignKey('workflow.Steps', to_field="step_id", on_delete=models.CASCADE)
    ticket_id = models.ForeignKey('tickets.Tickets', to_field="ticket_id", on_delete=models.CASCADE)
    status = models.CharField(max_length=255)

    class Meta:
        db_table = "step_instances"

class Instance_Logs(models.Model):
    instance_log_id = models.UUIDField(default=uuid.uuid4, unique=True)
    step_instance_id = models.ForeignKey(Step_Instances, to_field="step_instance_id", on_delete=models.CASCADE)
    transition_id = models.ForeignKey('workflow.Transitions', to_field="transition_id", on_delete=models.CASCADE)
    message = models.CharField(max_length=255)

    class Meta:
        db_table = "instance_logs"