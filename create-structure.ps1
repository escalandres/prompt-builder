# ======================================================
# Prompt Builder - Project Scaffold Script
# Creates missing folders and empty files
# ======================================================

$root = Get-Location

Write-Host "Creating Prompt Builder structure..." -ForegroundColor Cyan

# ------------------------------
# Directories
# ------------------------------
$dirs = @(
    "assets\icons",
    "assets\images",

    "templates",

    "src",
    "src\config",
    "src\core",
    "src\services",
    "src\templates",
    "src\components",
    "src\ui",
    "src\models",
    "src\validators",
    "src\formatters",
    "src\exporters",
    "src\importers",
    "src\llm",
    "src\utils",
    "src\styles",
    "src\tests"
)

foreach ($dir in $dirs) {
    $path = Join-Path $root $dir

    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created folder: $dir" -ForegroundColor Green
    }
}

# ------------------------------
# Files
# ------------------------------
$files = @(
    "index.html",
    "styles.css",
    "README.md",
    "LICENSE",

    "src\app.js",
    "src\state.js",

    "src\config\constants.js",
    "src\config\defaults.js",
    "src\config\settings.js",

    "src\core\renderer.js",
    "src\core\stateManager.js",
    "src\core\eventBus.js",
    "src\core\router.js",

    "src\services\clipboard.js",
    "src\services\storage.js",
    "src\services\xml.js",
    "src\services\download.js",
    "src\services\fileReader.js",
    "src\services\promptScore.js",

    "src\services\templateValidator.js",
    "src\services\templateExporter.js",
    "src\services\templateImporter.js",

    "src\templates\index.js",
    "src\components\exportTemplateModal.js",
    "src\components\importTemplateModal.js",
    "src\components\templateSelector.js",
    "src\components\constraintList.js",
    "src\components\variableList.js",
    "src\components\previewPanel.js",
    "src\components\toolbar.js",
    "src\components\notification.js",

    "src\ui\dom.js",
    "src\ui\modal.js",
    "src\ui\toast.js",
    "src\ui\dialog.js",
    "src\ui\loading.js",
    "src\ui\theme.js",

    "src\models\PromptTemplate.js",
    "src\models\PromptState.js",
    "src\models\Variable.js",
    "src\models\Constraint.js",

    "src\validators\promptValidator.js",
    "src\validators\xmlValidator.js",
    "src\validators\templateValidator.js",

    "src\formatters\xmlFormatter.js",
    "src\formatters\markdownFormatter.js",
    "src\formatters\jsonFormatter.js",

    "src\exporters\xmlExporter.js",
    "src\exporters\markdownExporter.js",
    "src\exporters\jsonExporter.js",
    "src\exporters\textExporter.js",
    "src\exporters\promptTemplateExporter.js",

    "src\importers\promptTemplateImporter.js",
    "src\importers\jsonImporter.js",

    "src\llm\ollama.js",
    "src\llm\lmstudio.js",
    "src\llm\openai.js",
    "src\llm\anthropic.js",
    "src\llm\promptRunner.js",

    "src\utils\clone.js",
    "src\utils\debounce.js",
    "src\utils\downloadFile.js",
    "src\utils\escapeXml.js",
    "src\utils\file.js",
    "src\utils\formatDate.js",
    "src\utils\slugify.js",
    "src\utils\uuid.js",
    "src\utils\validators.js",

    "src\styles\base.css",
    "src\styles\buttons.css",
    "src\styles\cards.css",
    "src\styles\dialog.css",
    "src\styles\forms.css",
    "src\styles\layout.css",
    "src\styles\preview.css",
    "src\styles\toolbar.css",
    "src\styles\variables.css",

    "src\tests\xml.test.js",
    "src\tests\storage.test.js",
    "src\tests\templates.test.js",
    "src\tests\validator.test.js",
    "src\tests\exporter.test.js"
)

foreach ($file in $files) {
    $path = Join-Path $root $file

    if (!(Test-Path $path)) {
        New-Item -ItemType File -Path $path -Force | Out-Null
        Write-Host "Created file: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nProject scaffold completed successfully." -ForegroundColor Cyan