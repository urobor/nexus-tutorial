"use strict";
exports.__esModule = true;
var nexus_1 = require("nexus");
nexus_1.schema.objectType({
    name: 'Post',
    definition: function (t) {
        t.int('id'); // <- Field named `id` of type `Int`
        t.string('title'); // <- Field named `title` of type `String`
        t.string('body'); // <- Field named `body` of type `String`
        t.boolean('published'); // <- Field named `published` of type `Boolean`
    }
});
nexus_1.schema.extendType({
    type: 'Query',
    definition: function (t) {
        t.field('drafts', {
            nullable: false,
            type: 'Post',
            list: true,
            resolve: function (_root, _args, ctx) {
                return ctx.db.posts.filter(function (p) { return p.published === false; }); // 2
            }
        }),
            t.list.field('posts', {
                type: 'Post',
                resolve: function (_root, _args, ctx) {
                    return ctx.db.posts.filter(function (p) { return p.published === true; });
                }
            });
    }
});
nexus_1.schema.extendType({
    type: 'Mutation',
    definition: function (t) {
        t.field('createDraft', {
            type: 'Post',
            args: {
                title: nexus_1.schema.stringArg({ required: true }),
                body: nexus_1.schema.stringArg({ required: true })
            },
            resolve: function (_root, args, ctx) {
                var draft = {
                    id: ctx.db.posts.length + 1,
                    title: args.title,
                    body: args.body,
                    published: false
                };
                ctx.db.posts.push(draft);
                return draft;
            }
        }),
            t.field('publish', {
                type: 'Post',
                args: {
                    draftId: nexus_1.schema.intArg({ required: true })
                },
                resolve: function (_root, args, ctx) {
                    var draftToPublish = ctx.db.posts.find(function (p) { return p.id === args.draftId; });
                    if (!draftToPublish) {
                        throw new Error('Could not find draft with id = ' + args.draftId);
                    }
                    draftToPublish.published = true;
                    return draftToPublish;
                }
            });
    }
});
