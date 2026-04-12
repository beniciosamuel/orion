import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";
import { Footer } from ".";

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: 720,
        padding: 16,
        color: "#121113",
      }}
      data-testid="footer-wrapper"
    >
      <Footer />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector("footer");

    await expect(footer).toBeInTheDocument();
    await expect(footer).toHaveTextContent(
      "2025 © Todos os direitos reservados a Cubos Movies",
    );
  },
};
