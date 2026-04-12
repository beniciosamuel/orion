import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect, fn } from "storybook/test";

import { Button } from ".";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  args: {
    onClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const PrimaryCompact: Story = {
  args: {
    children: "Log in",
    type: "submit",
    variant: "primary",
    size: "compact",
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button[type='submit']");

    await expect(button).toHaveTextContent("Log in");
    await expect(button).toHaveClass("primary");
    await expect(button).toHaveClass("compact");
  },
};

export const LinkAction: Story = {
  args: {
    children: "Forgot password?",
    type: "button",
    variant: "link",
    size: "full",
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button[type='button']");

    await expect(button).toHaveTextContent("Forgot password?");
    await expect(button).toHaveClass("link");
  },
};

export const Disabled: Story = {
  args: {
    children: "Submitting...",
    type: "submit",
    variant: "primary",
    size: "compact",
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button");

    await expect(button).toBeDisabled();
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    type: "button",
    variant: "secondary",
    size: "compact",
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button[type='button']");

    await expect(button).toHaveClass("secondary");
    await expect(button).toHaveTextContent("Secondary");
  },
};
