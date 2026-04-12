import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";

import { Input } from ".";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  args: {
    placeholder: "Enter your email",
    type: "email",
    id: "storybook-input",
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector("#storybook-input");

    await expect(input).toBeInTheDocument();
    await expect(input).toHaveAttribute("type", "email");
    await expect(input).toHaveAttribute("placeholder", "Enter your email");
  },
};

export const Error: Story = {
  args: {
    hasError: true,
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector("#storybook-input");

    await expect(input).toHaveClass("inputError");
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector("#storybook-input");

    await expect(input).toBeDisabled();
  },
};
