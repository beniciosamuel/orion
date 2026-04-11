import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";
import { CubosLogoIcon } from "./CubosLogo";

const meta: Meta<typeof CubosLogoIcon> = {
  title: "Components/Icons/CubosLogo",
  component: CubosLogoIcon,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof CubosLogoIcon>;

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
      <CubosLogoIcon />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute("viewBox", "0 0 143 140");
  },
};
