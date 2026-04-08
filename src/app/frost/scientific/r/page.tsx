"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import FrostContentPage from "@/components/FrostContentPage";

export default function RPage() {
  return (
    <FrostContentPage
      title="R"
      subtitle="The language of statisticians — built for data analysis, statistical modeling, and publication-quality graphics."
      backHref="/frost/scientific"
      backLabel="Back to Scientific Software"
      breadcrumbs={[{ label: "FROST", href: "/frost" }, { label: "Scientific", href: "/frost/scientific" }]}
      accentColor="#818cf8"
    >
      <Box className="frost-section">
        <Typography className="frost-h2">What is R?</Typography>
        <Typography className="frost-p">
          R is a free, open-source language and environment designed specifically for statistical computing and data visualization.
          It has become the standard tool in statistics, bioinformatics, social sciences, and quantitative research.
          R&apos;s package ecosystem (CRAN — over 20,000 packages) covers virtually every statistical method ever published.
        </Typography>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Download & Install</Typography>
        <Box component="ol" className="frost-ul" sx={{ listStyleType: "decimal" }}>
          <li>Download R from <Box component="span" className="frost-code">cran.r-project.org</Box> — choose your OS (Windows/macOS/Linux)</li>
          <li>Install <strong>RStudio Desktop</strong> from <Box component="span" className="frost-code">posit.co/download/rstudio-desktop</Box> — the standard IDE for R (free)</li>
          <li>Launch RStudio — R is automatically detected</li>
        </Box>
        <Box component="pre" className="frost-pre">{`# On Ubuntu/Debian Linux
sudo apt install r-base r-base-dev

# Install RStudio separately from posit.co`}</Box>
        <Box className="frost-note">
          R and RStudio are completely free. No license server or institutional account required.
        </Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Essential Packages</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>tidyverse</strong> — ggplot2, dplyr, tidyr, readr, purrr — the core data science toolkit</li>
          <li><strong>ggplot2</strong> — grammar-of-graphics based plotting, publication-ready figures</li>
          <li><strong>dplyr</strong> — data manipulation: filter, select, mutate, group_by, summarise</li>
          <li><strong>caret / tidymodels</strong> — machine learning model training and evaluation</li>
          <li><strong>lme4</strong> — linear and mixed effects models</li>
          <li><strong>survival</strong> — survival analysis, Kaplan-Meier curves</li>
          <li><strong>Rmarkdown / Quarto</strong> — reproducible research documents combining code and text</li>
          <li><strong>Shiny</strong> — interactive web apps directly from R code</li>
        </Box>
        <Box component="pre" className="frost-pre">{`# Install packages from CRAN
install.packages("tidyverse")
install.packages(c("caret", "lme4", "survival"))

# Load a package
library(tidyverse)`}</Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Quick Example</Typography>
        <Box component="pre" className="frost-pre">{`library(tidyverse)

# Built-in dataset
data(mtcars)

# Summary statistics
summary(mtcars$mpg)

# Linear regression
model <- lm(mpg ~ wt + hp, data = mtcars)
summary(model)

# Plot
ggplot(mtcars, aes(x = wt, y = mpg, color = factor(cyl))) +
  geom_point(size = 3) +
  geom_smooth(method = "lm") +
  labs(title = "MPG vs Weight", x = "Weight", y = "Miles per Gallon")`}</Box>
      </Box>

      <Box className="frost-section">
        <Typography className="frost-h2">Learning Resources</Typography>
        <Box component="ul" className="frost-ul">
          <li><strong>R for Data Science</strong> (Hadley Wickham) — free online at <Box component="span" className="frost-code">r4ds.had.co.nz</Box></li>
          <li><strong>Swirl</strong> — learn R interactively inside R itself: <Box component="span" className="frost-code">install.packages("swirl")</Box></li>
          <li>RStudio Cheatsheets — <Box component="span" className="frost-code">posit.co/resources/cheatsheets</Box> — one-page references for ggplot2, dplyr, etc.</li>
          <li>CRAN Task Views — curated package lists by domain (e.g., Econometrics, Survival, MachineLearning)</li>
        </Box>
      </Box>
    </FrostContentPage>
  );
}
