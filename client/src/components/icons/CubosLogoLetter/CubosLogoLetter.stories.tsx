import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";
import { CubosLogoLetterIcon } from "./CubosLogoLetter";

const meta: Meta<typeof CubosLogoLetterIcon> = {
  title: "Components/Icons/CubosLogoLetter",
  component: CubosLogoLetterIcon,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof CubosLogoLetterIcon>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: 160,
        height: 160,
        color: "#121113",
        display: "grid",
        placeItems: "center",
      }}
      data-testid="cubos-logo-wrapper"
    >
      <CubosLogoLetterIcon />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute("viewBox", "0 0 444 76");
  },
};
