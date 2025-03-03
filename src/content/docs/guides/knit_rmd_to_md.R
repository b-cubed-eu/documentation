# Function to add YAML back to the .md output
knit_rmd_to_md <- function(path, input_rmd) {
  # Knit the Rmd file to markdown
  knitr::knit(
    input = file.path(path, input_rmd),
    output = file.path(path, gsub("Rmd", "md", input_rmd)),
    quiet = FALSE)
}
