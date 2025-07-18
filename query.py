from django.db import transaction

class UpdateWorkflow(graphene.Mutation):
    class Arguments:
        input = WorkflowInputType(required=True)  # Match shape of your query
    
    ok = graphene.Boolean()

    @transaction.atomic
    def mutate(root, info, input):
        workflow = Workflows.objects.get(workflow_id=input['workflowId'])

        # 1. Update workflow base fields
        workflow.category = input['category']
        workflow.sub_category = input['subCategory']
        workflow.department = input['department']
        workflow.status = input['status']
        workflow.is_published = input['isPublished']

        # i dont like this part of code, its wants me to list all fields, i want something more dynamic
        workflow.save()

        # 2. Sync steps
        incoming_steps = input['steps']
        incoming_step_ids = []

        for step_data in incoming_steps:
            step_id = step_data.get('stepId')
            role = Roles.objects.get(role_id=step_data['roleId']['roleId'])

            step, created = Steps.objects.update_or_create(
                step_id=step_id,
                defaults={
                    "workflow": workflow,
                    "instruction": step_data['instruction'],
                    "role_id": role
                }
            )
            incoming_step_ids.append(step.step_id)

        # Delete removed steps
        Steps.objects.filter(workflow=workflow).exclude(step_id__in=incoming_step_ids).delete()

        # 3. Sync transitions
        incoming_transitions = input['transitions']
        incoming_transition_ids = []

        for trans_data in incoming_transitions:
            trans_id = trans_data.get('transitionId')
            from_step_id = trans_data['fromStep']['stepId']
            to_step_id = trans_data['toStep']['stepId']

            from_step = Steps.objects.get(step_id=from_step_id)
            to_step = Steps.objects.get(step_id=to_step_id)

            transition, created = Transitions.objects.update_or_create(
                transition_id=trans_id,
                defaults={
                    "from_step": from_step,
                    "to_step": to_step,
                    "name": trans_data['name']
                }
            )
            incoming_transition_ids.append(transition.transition_id)

        # Delete removed transitions
        Transitions.objects.filter(
            Q(from_step__workflow=workflow) | Q(to_step__workflow=workflow)
        ).exclude(transition_id__in=incoming_transition_ids).delete()

        return UpdateWorkflow(ok=True)