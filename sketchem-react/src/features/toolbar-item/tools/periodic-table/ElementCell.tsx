import type { PtElement } from "@constants/elements.constants";
import styles from "@styles/index.module.scss";
import clsx from "clsx";
import React from "react";
import { Button } from "react-bootstrap";

interface IElementProps {
    element: PtElement;
    onClick: (number: number) => void;
}

export function ElementCell(props: IElementProps) {
    const { element, onClick } = props;
    const btnClass = element.category.includes("unknown")
        ? styles.periodic_table_category_unknown
        : styles[`periodic_table_category_${element.category.replaceAll(" ", "_")}`];

    return (
        <Button onClick={() => onClick(element.number)} className={clsx(styles.periodic_table_cell_button, btnClass)}>
            <div className={styles.periodic_table_number}>{element.number}</div>
            <div className={styles.periodic_table_symbol}>{element.symbol}</div>
            {/* <div className={styles.periodic_table_name}>{element.name}</div> */}
        </Button>
    );
}
