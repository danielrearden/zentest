import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "All in One Place",
    Svg: require("@site/static/img/undraw_performance_overview.svg").default,
    description: (
      <>
        View test results across different projects, environments and testing
        frameworks.
      </>
    ),
  },
  {
    title: "Insights That Matter",
    Svg: require("@site/static/img/undraw_all_the_data.svg").default,
    description: (
      <>
        Easily identify problem tests so that you can reduce flakiness and
        improve test performance.
      </>
    ),
  },
  {
    title: "Peace of Mind",
    Svg: require("@site/static/img/undraw_meditation.svg").default,
    description: (
      <>
        Spend less time debugging tests and more time building your application.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
