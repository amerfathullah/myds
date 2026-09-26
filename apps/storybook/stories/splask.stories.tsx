import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@govtechmy/myds-react/accordion";
import { Button } from "@govtechmy/myds-react/button";
import { Footer } from "@govtechmy/myds-react/footer";
import { Link } from "@govtechmy/myds-react/link";
import { Navbar } from "@govtechmy/myds-react/navbar";
import {
  SearchBar,
  SearchBarInput,
  SearchBarInputContainer,
  SearchBarResults,
  SearchBarResultsList,
} from "@govtechmy/myds-react/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@govtechmy/myds-react/select";

/**
 * SPLaSK tagging is done by passing raw `splwpk-*` attributes to MYDS components, e.g.
 * `<Link splwpk-faqs="splwpk-faqs">`. Each story here passes an arbitrary `splwpk-*` attribute
 * to one component part and asserts that it reaches that part's rendered DOM element unchanged.
 */
const meta = {
  title: "Tests/SPLaSK Tag Pass-through",
  tags: ["!autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TAG = "splwpk-test";

/** The element a component renders as its root, i.e. with no wrapper in between. */
const rootOf = (canvasElement: HTMLElement) =>
  canvasElement.firstElementChild as HTMLElement;

export const LinkTag: Story = {
  render: () => (
    <Link href="#" splwpk-test={TAG}>
      Soalan Lazim
    </Link>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link");
    await expect(link).toHaveAttribute(TAG, TAG);
  },
};

export const LinkAsChildTag: Story = {
  render: () => (
    <Link asChild splwpk-test={TAG}>
      <a href="#">Soalan Lazim</a>
    </Link>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link");
    await expect(link).toHaveAttribute(TAG, TAG);
  },
};

export const ButtonTag: Story = {
  render: () => <Button splwpk-test={TAG}>Hantar</Button>,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    await expect(button).toHaveAttribute(TAG, TAG);
  },
};

export const SearchBarTag: Story = {
  render: () => (
    <SearchBar splwpk-test={TAG}>
      <SearchBarInputContainer>
        <SearchBarInput aria-label="Carian" placeholder="Carian" />
      </SearchBarInputContainer>
      <SearchBarResults open={false}>
        <SearchBarResultsList />
      </SearchBarResults>
    </SearchBar>
  ),
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement);
    await expect(root).toContainElement(
      within(canvasElement).getByRole("combobox"),
    );
    await expect(root).toHaveAttribute(TAG, TAG);
  },
};

export const AccordionTag: Story = {
  render: () => (
    <Accordion type="single" collapsible splwpk-test={TAG}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Apakah MYDS?</AccordionTrigger>
        <AccordionContent>Sistem Reka Bentuk Malaysia.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement);
    await expect(root).toContainElement(
      within(canvasElement).getByRole("button"),
    );
    await expect(root).toHaveAttribute(TAG, TAG);
  },
};

export const SelectTriggerTag: Story = {
  render: () => (
    <Select variant="outline" size="small">
      <SelectTrigger aria-label="Pilih bahasa" splwpk-test={TAG}>
        <SelectValue label="Bahasa" placeholder="Pilih" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ms">Bahasa Melayu</SelectItem>
        <SelectItem value="en">English</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox");
    await expect(trigger).toHaveAttribute(TAG, TAG);
  },
};

export const NavbarTag: Story = {
  parameters: { layout: "fullscreen" },
  render: () => <Navbar splwpk-test={TAG} />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement);
    await expect(root.tagName).toBe("HEADER");
    await expect(root).toHaveAttribute(TAG, TAG);
  },
};

export const FooterTag: Story = {
  parameters: { layout: "fullscreen" },
  render: () => <Footer splwpk-test={TAG} />,
  play: async ({ canvasElement }) => {
    const root = rootOf(canvasElement);
    await expect(root.tagName).toBe("FOOTER");
    await expect(root).toHaveAttribute(TAG, TAG);
  },
};
