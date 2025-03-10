devtools::install_github("b-cubed-eu/b3doc#1")

library(b3doc)
library(purrr)

rmd_files <- c(
  "https://raw.githubusercontent.com/b-cubed-eu/gcube/refs/heads/main/README.Rmd", #md also available
  "https://raw.githubusercontent.com/b-cubed-eu/gcube/refs/heads/main/vignettes/articles/occurrence-process.Rmd",
  "https://raw.githubusercontent.com/b-cubed-eu/gcube/refs/heads/main/vignettes/articles/detection-process.Rmd",
  "https://raw.githubusercontent.com/b-cubed-eu/gcube/refs/heads/main/vignettes/articles/grid-designation-process.Rmd",
  "https://raw.githubusercontent.com/b-cubed-eu/gcube/refs/heads/main/vignettes/articles/multi-species-approach.Rmd"
)

md_dir <- file.path("src", "content", "docs", "software", "gcube")
fig_dir <- file.path("public", "software", "gcube")
fig_url_dir <- "/software/gcube/"

purrr::walk(rmd_files, ~rmd_to_md(.x, md_dir, fig_dir, fig_url_dir))
