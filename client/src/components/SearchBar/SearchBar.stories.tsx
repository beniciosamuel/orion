import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";

import { SearchBar } from ".";

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  args: {
    id: "storybook-searchbar",
    placeholder: "Search for movies",
    "aria-label": "Search movies",
  },
};

export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector("#storybook-searchbar");

    await expect(input).toBeInTheDocument();
    await expect(input).toHaveAttribute("type", "search");
  },
};

export const Error: Story = {
  args: {
    hasError: true,
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector("#storybook-searchbar");

    await expect(input).toHaveClass("inputError");
  },
};
