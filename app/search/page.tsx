'use client'

import React from "react";
import GUI from "../components/GUI";
import styles from "../page.module.css";
import { useAppContext } from "../providers/AppProvider";

export default function Search() {
    const {
        filtered
    } = useAppContext();

    return (
        <div className={styles.page}>
            {
                filtered.length > 0 && (
                    filtered.map((idea, index) => (
                        <React.Fragment key={index}>
                            <div className={styles.spacer} />
                            <GUI
                                key={idea.id}
                                operation={'read'}
                                idea={idea}
                            />
                        </React.Fragment> )
                    )
                )}
        </div >
    );
}