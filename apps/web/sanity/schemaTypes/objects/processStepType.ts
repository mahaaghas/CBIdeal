import { defineField, defineType } from "sanity"

export const processStepType = defineType({
  name: "processStep",
  title: "Process step",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      initialValue: "shield-check",
      options: {
        list: [
          { title: "Shield", value: "shield-check" },
          { title: "Globe", value: "globe-2" },
          { title: "Coins", value: "hand-coins" },
          { title: "Users", value: "users" },
          { title: "Building", value: "building-2" },
          { title: "Messages", value: "messages-square" },
          { title: "File", value: "file-check-2" },
          { title: "Chart", value: "bar-chart-3" },
          { title: "Compass", value: "compass" },
          { title: "Monitor", value: "monitor-play" },
        ],
      },
    }),
  ],
})
