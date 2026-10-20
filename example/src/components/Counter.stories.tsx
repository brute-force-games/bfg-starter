import type { Meta, StoryObj } from "@storybook/react-vite";
import { Counter } from "./Counter";

const meta = { component: Counter } satisfies Meta<typeof Counter>;
export default meta;

/** Before any press. */
export const Unpressed: StoryObj<typeof meta> = {};
