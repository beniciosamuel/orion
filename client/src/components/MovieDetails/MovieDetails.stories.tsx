import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";

import { MovieDetails } from ".";
import styles from "./MovieDetails.module.css";

const meta: Meta<typeof MovieDetails> = {
  title: "Components/MovieDetails",
  component: MovieDetails,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof MovieDetails>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const title = canvasElement.querySelector(`.${styles.title}`);
    const originalTitle = canvasElement.querySelector(
      `.${styles.originalTitle}`,
    );
    const tags = canvasElement.querySelectorAll(`.${styles.tag}`);
    const infoCards = canvasElement.querySelectorAll(`.${styles.infoCard}`);

    await expect(title).toHaveTextContent("Bumblebee");
    await expect(originalTitle).toHaveTextContent("Título original: Bumblebee");
    await expect(tags.length).toBeGreaterThan(0);
    await expect(infoCards.length).toBe(9);
  },
};
