import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q

from .models import Task, Comment, Like
from apps.users.schema import UserType


class TaskType(DjangoObjectType):
    class Meta:
        model = Task


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment


class LikeType(DjangoObjectType):
    class Meta:
        model = Like

# list all tasks or filtered


class Query(graphene.ObjectType):
    tasks = graphene.List(TaskType, search=graphene.String())
    comments = graphene.List(CommentType)
    likes = graphene.List(LikeType)

    def resolve_tasks(self, info, search=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(posted_by__username__icontains=search)
            )
            return Task.objects.filter(filter)
        return Task.objects.all()

    def resolve_comments(self, info):
        return Comment.objects.all()

    def resolve_likes(self, info):
        return Like.objects.all()


class CreateTask(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()

    def mutate(self, info, title, description):
        user = info.context.user or None

        if user.is_anonymous:
            raise GraphQLError('Log in to add a task.')

        task = Task(title=title, description=description, posted_by=user)
        task.save()
        return CreateTask(task=task)


class UpdateTask(graphene.Mutation):
    task = graphene.Field(TaskType)

    class Arguments:
        task_id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()

    def mutate(self, info, task_id, title, description):
        user = info.context.user
        task = Task.objects.get(id=task_id)

        if task.posted_by != user:
            raise GraphQLError('Not permitted to update this task')

        task.title = title
        task.description = description

        task.save()

        return UpdateTask(task=task)


class DeleteTask(graphene.Mutation):
    task_id = graphene.Int()

    class Arguments:
        task_id = graphene.Int(required=True)

    def mutate(self, info, task_id):
        user = info.context.user
        task = Task.objects.get(id=task_id)

        if task.posted_by != user:
            raise GraphQLError('Not permitted to delete this task')

        task.delete()

        return DeleteTask(task_id=task_id)


class CreateComment(graphene.Mutation):
    comment = graphene.Field(CommentType)
    task = graphene.Field(TaskType)
    user = graphene.Field(UserType)

    class Arguments:
        task_id = graphene.Int(required=True)
        description = graphene.String()
        comment_id = graphene.Int()

    def mutate(self, info, task_id, description, comment_id):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Login to comment tasks.')

        task = Task.objects.get(id=task_id)
        if not task:
            raise GraphQLError('Cannot find task with given task id')

        parent = Comment.objects.get(id=comment_id)
        if not parent:
            parent = None

        comment = Comment(description=description,
                          comment_by=user, task=task, parent=parent)
        comment.save()

        return CreateComment(comment=comment, user=user, task=task)


class CreateLike(graphene.Mutation):
    user = graphene.Field(UserType)
    task = graphene.Field(TaskType)

    class Arguments:
        task_id = graphene.Int(required=True)

    def mutate(self, info, task_id):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Login to like tasks.')

        task = Task.objects.get(id=task_id)
        if not task:
            raise GraphQLError('Cannot find task with given task id')

        Like.objects.create(
            user=user,
            task=task
        )

        return CreateLike(user=user, task=task)


class Mutation(graphene.ObjectType):
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()
    create_comment = CreateComment.Field()
    create_like = CreateLike.Field()
