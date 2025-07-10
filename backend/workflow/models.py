import uuid
from django.db import models

class Workflow(models.Model):
    id = models.BigAutoField(primary_key=True)
    workflow_id = models.UUIDField(default=uuid.uuid4, unique=True)
    category = models.CharField(max_length=255)
    sub_category = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    is_published = models.BooleanField(null=True, blank=True)
    status = models.CharField(max_length=255)

    class Meta:
        db_table = "workflows"


class Role(models.Model):
    id = models.BigAutoField(primary_key=True)
    role_id = models.UUIDField(default=uuid.uuid4, unique=True)
    system_id = models.UUIDField()

    class Meta:
        db_table = "roles"


class UserSystemRole(models.Model):
    id = models.BigAutoField(primary_key=True)
    system_role_id = models.UUIDField(unique=True)
    user_id = models.UUIDField()
    system_id = models.UUIDField()
    role_id = models.UUIDField()

    class Meta:
        db_table = "user_system_roles"


class Step(models.Model):
    id = models.BigAutoField(primary_key=True)
    step_id = models.UUIDField(default=uuid.uuid4, unique=True)
    workflow = models.ForeignKey(Workflow, to_field="workflow_id", on_delete=models.CASCADE)
    system_role = models.ForeignKey(UserSystemRole, to_field="system_role_id", on_delete=models.CASCADE)
    instruction = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "steps"


class Transition(models.Model):
    id = models.BigAutoField(primary_key=True)
    transition_id = models.UUIDField(default=uuid.uuid4, unique=True)
    from_step = models.ForeignKey(Step, to_field="step_id", related_name="transitions_from", on_delete=models.CASCADE)
    to_step = models.ForeignKey(Step, to_field="step_id", related_name="transitions_to", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "transitions"
