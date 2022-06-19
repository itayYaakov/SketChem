import { ElementsData } from "@constants/elements.constants";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React from "react";

import { ElementCell } from "./ElementCell";

const MaxRow = 10;
const MaxColumn = 18;

interface PeriodicTableProps {
    className?: string | undefined;
    // eslint-disable-next-line react/no-unused-prop-types
    onAtomClick?: ((atomLabel: string) => void) | undefined;
}

function buildCell(props: PeriodicTableProps, j: number, i: number) {
    const { onAtomClick } = props;
    const key = `periodic_table_cell-${i}-${j}`;

    let cell;
    let scope;
    let uniqueStyle;
    if (i === 0 && j === 0) {
        cell = null;
        scope = "col";
        uniqueStyle = { width: "1em", height: "auto" };
    } else if (i === 0) {
        cell = j;
        scope = "col";
    } else if (j === 0) {
        if (i > 7) {
            cell = null;
        } else {
            cell = i;
        }
        scope = "row";
    }

    // handle labels header and first column
    if (scope) {
        return (
            <th scope={scope} style={uniqueStyle} key={key} className={clsx(styles.periodic_table_cell)}>
                {cell}
            </th>
        );
    }

    let group: string[] = [];
    if ((i === 6 && j === 3) || (i === 9 && j === 2)) {
        cell = "*";
        group = [styles.periodic_table_category_lanthanide, styles.periodic_table_symbol, styles.unclickable_div];
    } else if ((i === 7 && j === 3) || (i === 10 && j === 2)) {
        cell = "**";
        group = [styles.periodic_table_category_actinide, styles.periodic_table_symbol, styles.unclickable_div];
    } else if (i === 8) {
        uniqueStyle = { height: "3em" };
    }

    if (!cell) {
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

    // <div key={key} className={clsx(styles.periodic_table_cell, "rounded-0")}>
    return (
        <td key={key} style={uniqueStyle} className={clsx(styles.periodic_table_cell, group)}>
            {cell}
        </td>
    );
}

function buildRow(props: PeriodicTableProps, i: number) {
    const cells: JSX.Element[] = [];
    for (let j = 0; j <= MaxColumn; j += 1) {
        cells.push(buildCell(props, j, i));
    }
    const key = `periodic_table_row-${i}`;
    return (
        <tr key={key} className={clsx(styles.periodic_table_row)}>
            {cells}
        </tr>
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
    return (
        <table className={fullClassName}>
            <tbody>{table}</tbody>
        </table>
    );
}

PeriodicTable.defaultProps = {
    className: "",
    onAtomClick: () => {
        // currently not used, in the future it will be used to show the atom details, or select multiple atoms
    },
};

export default PeriodicTable;
