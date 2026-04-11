import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";
import { FilterIcon } from "./Filter";

const meta: Meta<typeof FilterIcon> = {
  title: "Components/Icons/Filter",
  component: FilterIcon,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof FilterIcon>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: 9,
        height: 14,
        color: "#131211",
        display: "grid",
        placeItems: "center",
      }}
      data-testid="filter-wrapper"
    >
      <FilterIcon />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");

    await expect(svg).toBeInTheDocument();
    await expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  },
};
