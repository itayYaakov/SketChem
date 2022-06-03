import type { PtElement } from "@constants/elements.constants";
import { ElementsData } from "@constants/elements.constants";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React from "react";

import { ElementCell } from "./ElementCell";

const MaxRow = 10;
const MaxColumn = 18;

interface PeriodicTableProps {
    className?: string | undefined;
    onAtomClick?: ((atomLabel: string) => void) | undefined;
}

function buildCell(props: PeriodicTableProps, j: number, i: number) {
    const { onAtomClick } = props;
    let cell;
    if (i === 0 && j === 0) {
        cell = null;
    } else if (i === 0) {
        cell = j;
    } else if (j === 0) {
        if (i > 7) {
            cell = null;
        } else {
            cell = i;
        }
    } else {
        const ff = ElementsData.elementsByXYMap;
        const element = ElementsData.elementsByXYMap.get(`${i}|${j}`);
        if (!element || element.number > ElementsData.MaxAtomicNumber) {
            cell = null;
        } else {
            cell = ElementCell({
                element,
                onClick: () => {
                    onAtomClick?.(element.symbol);
                },
            });
        }
    }
    const key = `periodic_table_cell-${i}-${j}`;

    // <div key={key} className={clsx(styles.periodic_table_cell, "rounded-0")}>
    return (
        <div key={key} className={clsx(styles.periodic_table_cell)}>
            {cell}
        </div>
    );
}

function buildRow(props: PeriodicTableProps, i: number) {
    const cells: JSX.Element[] = [];
    for (let j = 0; j <= MaxColumn; j += 1) {
        cells.push(buildCell(props, j, i));
    }
    const key = `periodic_table_row-${i}`;
    return (
        <div key={key} className={clsx(styles.periodic_table_row)}>
            {cells}
        </div>
    );
}

function buildTable(props: PeriodicTableProps) {
    const rows: JSX.Element[] = [];

    for (let i = 0; i <= MaxRow; i += 1) {
        rows.push(buildRow(props, i));
    }

    return rows;
}

function PeriodicTable(props: PeriodicTableProps) {
    const table = buildTable(props);
    const { className } = props;
    const fullClassName = clsx(styles.periodic_table, className ?? "");
    return <div className={fullClassName}>{table}</div>;
}

PeriodicTable.defaultProps = {
    className: "",
    onAtomClick: () => {},
};

export default PeriodicTable;
