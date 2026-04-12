import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";

import { MovieCard } from ".";
import styles from "./MovieCard.module.css";

const meta: Meta<typeof MovieCard> = {
  title: "Components/MovieCard",
  component: MovieCard,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof MovieCard>;

export const Default: Story = {
  args: {
    title: "Bumblebee",
  },
  play: async ({ canvasElement }) => {
    const image = canvasElement.querySelector("img");
    const title = canvasElement.querySelector(`.${styles.title}`);
    const categories = canvasElement.querySelector(`.${styles.categories}`);
    const voteValue = canvasElement.querySelector(`.${styles.voteValue}`);

    await expect(image).toBeInTheDocument();
    await expect(image).toHaveAttribute("src");
    await expect(image).toHaveAttribute("alt", "Movie poster");
    await expect(title).toHaveTextContent("Bumblebee");
    await expect(categories).toHaveTextContent(
      "Ação, Aventura, Ficção Científica",
    );
    await expect(voteValue).toHaveTextContent("86%");
  },
};
