import { fileURLToPath } from "url";
import { defineNuxtModule, createResolver, addComponent } from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "nuxt-mermaid",
    configKey: "nuxtMermaid",
  },
  setup(options, nuxt) {
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.runtimeConfig = nitroConfig.runtimeConfig || {};
      nitroConfig.runtimeConfig.content.markdown.remarkPlugins = {
        "@nuxt-mermaid/remark-mermaid-plugin": {},
      };
    });
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));
    addComponent({
      name: "NuxtMermaid",
      filePath: resolve(runtimeDir, "NuxtMermaid.ts"),
      global: true,
    });
  },
});
