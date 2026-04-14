import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect } from "storybook/test";
import { Header } from ".";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: 720,
        padding: 16,
        color: "#121113",
      }}
      data-testid="header-wrapper"
    >
      <Header onSignOut={() => undefined} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector("header");
    const themeSwitcher = canvasElement.querySelector(
      "button[data-testid='theme-switcher']",
    );
    const signOutButton = canvasElement.querySelector(
      "button:not([data-testid])",
    );

    await expect(header).toBeInTheDocument();
    await expect(themeSwitcher).toBeInTheDocument();
    await expect(signOutButton).toBeInTheDocument();
    await expect(signOutButton).toHaveTextContent("Sign Out");
  },
};
