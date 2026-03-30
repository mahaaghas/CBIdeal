"use client"

import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"

import { apiVersion, dataset, projectId } from "./sanity/env"
import { schemaTypes } from "./sanity/schemaTypes"
import { deskStructure } from "./sanity/structure"

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool({
      defaultApiVersion: apiVersion,
    }),
  ],
})
