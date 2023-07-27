import {
  PaginatorFirstPageLinkOptions,
  PaginatorPrevPageLinkOptions,
  PaginatorPageLinksOptions,
  PaginatorLastPageLinkOptions,
  PaginatorNextPageLinkOptions,
} from "primereact/paginator";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { COLORS } from "../../themes";

export const paginationTemplate = {
  layout: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink",
  FirstPageLink: (options: PaginatorFirstPageLinkOptions) => {
    return (
      <Button
        className={classNames(options.className, "border-round")}
        icon="pi pi-step-backward-alt"
        onClick={options.onClick}
        disabled={options.disabled}
      />
    );
  },
  PrevPageLink: (options: PaginatorPrevPageLinkOptions) => {
    return (
      <Button
        className={classNames(options.className, "border-round")}
        icon="pi pi-caret-left"
        onClick={options.onClick}
        disabled={options.disabled}
      />
    );
  },
  PageLinks: (options: PaginatorPageLinksOptions) => {
    return (
      <Button
        label={String(options.currentPage)}
        className={classNames(options.className, "border-round")}
        style={{ background: COLORS.grey, color: COLORS.white }}
        disabled={true}
      />
    );
  },
  NextPageLink: (options: PaginatorNextPageLinkOptions) => {
    return (
      <Button
        className={classNames(options.className, "border-round")}
        icon="pi pi-caret-right"
        onClick={options.onClick}
        disabled={options.disabled}
      />
    );
  },
  LastPageLink: (options: PaginatorLastPageLinkOptions) => {
    return (
      <Button
        className={classNames(options.className, "border-round")}
        icon="pi pi-step-forward-alt"
        onClick={options.onClick}
        disabled={options.disabled}
      />
    );
  },
};
