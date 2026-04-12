import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";

import { MovieList } from ".";

const meta: Meta<typeof MovieList> = {
  title: "Components/MovieList",
  component: MovieList,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof MovieList>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const cards = canvasElement.querySelectorAll("article");
    const previousButton = canvasElement.querySelector(
      'button[aria-label="Previous movies"]',
    );
    const nextButton = canvasElement.querySelector(
      'button[aria-label="Next movies"]',
    );

    await expect(cards).toHaveLength(10);
    await expect(previousButton).toBeInTheDocument();
    await expect(nextButton).toBeInTheDocument();
  },
};
