import graphene
from graphene_django.types import DjangoObjectType
from .models import Post, Collection

class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = ("id", "title", "content", "published", "created_at", "collections")

class CollectionType(DjangoObjectType):
    class Meta:
        model = Collection
        fields = ("id", "description", "name", "post", "created_at")

class Query(graphene.ObjectType):
    all_posts = graphene.List(PostType)
    post = graphene.Field(PostType, id=graphene.Int(required=True))

    # collection
    all_collections = graphene.List(CollectionType)
    collection = graphene.Field(CollectionType, id=graphene.Int(required=True))


    # post resolvers
    def resolve_all_posts(root, info):
        return Post.objects.all()

    def resolve_post(root, info, id):
        return Post.objects.get(pk=id)
    
    # collection resolvers
    def resolve_all_collections(root, info):
        return Collection.objects.all()
    def resolve_collection(root, info, id):
        return Collection.objects.get(pk=id)

class CreateCollection(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()
        post_id = graphene.Int(required=True)

    collection = graphene.Field(CollectionType)

    def mutate(self, info, name, description=None, post_id=None):
        post = Post.objects.get(pk=post_id)
        collection = Collection(name=name, description=description, post=post)
        collection.save()
        return CreateCollection(collection=collection)
    
class UpdateCollection(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        description = graphene.String()

    collection = graphene.Field(CollectionType)

    def mutate(self, info, id, name=None, description=None):
        collection = Collection.objects.get(pk=id)
        if name is not None:
            collection.name = name
        if description is not None:
            collection.description = description
        collection.save()
        return UpdateCollection(collection=collection)

class CreatePost(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        content = graphene.String(required=True)
        published = graphene.Boolean(default_value=False)

    post = graphene.Field(PostType)

    def mutate(self, info, title, content, published):
        post = Post(title=title, content=content, published=published)
        post.save()
        return CreatePost(post=post)

class UpdatePost(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String()
        content = graphene.String()
        published = graphene.Boolean()

    post = graphene.Field(PostType)

    def mutate(self, info, id, title=None, content=None, published=None):
        post = Post.objects.get(pk=id)
        if title is not None:
            post.title = title
        if content is not None:
            post.content = content
        if published is not None:
            post.published = published
        post.save()
        return UpdatePost(post=post)

class DeletePost(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        try:
            post = Post.objects.get(pk=id)
            post.delete()
            return DeletePost(ok=True)
        except Post.DoesNotExist:
            return DeletePost(ok=False)

class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()
    delete_post = DeletePost.Field()
    create_collection = CreateCollection.Field()
    update_collection = UpdateCollection.Field()
