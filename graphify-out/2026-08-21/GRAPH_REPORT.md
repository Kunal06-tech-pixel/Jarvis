# Graph Report - VOICE  (2026-08-21)

## Corpus Check
- 223 files · ~366,276 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3843 nodes · 8364 edges · 210 communities (170 shown, 40 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 113 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7cf44790`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- live-browser.js
- checks.mjs
- react
- connectSSE
- index.mjs
- detect-antipatterns-browser.js
- setLiveState
- initGlobalBar
- live-inject.mjs
- design-system.mjs
- css-cascade.mjs
- context.mjs
- modern-screenshot.umd.js
- manual-apply.mjs
- hook-lib.mjs
- el
- live-commit-manual-edits.mjs
- detect-antipatterns.mjs
- impeccable-config.mjs
- initPageChat
- svelte-component.mjs
- live-server.mjs
- staleness.mjs
- hook-admin.mjs
- live-wrap.mjs
- insert-ui.mjs
- doctor.md
- hook-before-edit.mjs
- live-accept.mjs
- concept-seed.mjs
- scanCssTextForPulsingDot
- design-parser.mjs
- detect-html.mjs
- live-copy-edit-agent.mjs
- scanCssTextForPulsingDot
- live-poll.mjs
- dependencies
- parseAnyColor
- compilerOptions
- critique-storage.mjs
- runHook
- resolveLengthPx
- manual-edit-routes.mjs
- live-manual-edit-evidence.mjs
- showToast
- routes/index.ts
- impeccable-paths.mjs
- captureElementToBlob
- pushController.ts
- onAnnotDown
- loadContext
- collectBrowserFindings
- readLiveServerInfo
- devDependencies
- compilerOptions
- doctor.mjs
- server/package.json
- Web 3D Integration Patterns
- localCommand.ts
- createLiveBrowserSessionState
- components.json
- context-signals.mjs
- analyzeVisualContrastCandidate
- sampleCssBackground
- serve-question.mjs
- checkHeadingRhythmDOM
- checkHeadingRhythmDOM
- generate-image.mjs
- createLiveBrowserDomHelpers
- dependencies
- session-store.mjs
- pin.mjs
- compilerOptions
- colorize.md
- telegramService.ts
- Animation Standards Reference
- generation-preflight.mjs
- scripts
- detect-csp.mjs
- checkTextOcclusionDOM
- template-extensions.mjs
- palette.mjs
- plugins
- authController.ts
- staleness-notice.mjs
- detect-url.mjs
- prisma.ts
- ui-core.mjs
- client/package.json
- discoverTargetCandidates
- package.json
- checkQuality
- iOS platform
- $impeccable hooks
- resolveLiveInjectionAnchor
- @hookform/resolvers
- compilerOptions
- Responsive Design
- live.md
- detect.mjs
- hook.mjs
- VoiceAssistant.tsx
- sonner.tsx
- seed.ts
- express.d.ts
- Settings.tsx
- Scan mode (approach C: auto-extract, then confirm descriptive language)
- Animation Audit Playbook
- @radix-ui/react-label
- syncEditBadgeHitProxies
- typeset.md
- react-router-dom
- onboard.md
- tailwind-merge
- Apple Design
- three
- @types/animejs
- The Toolkit
- zod
- Workflow
- bolder.md
- normalizeGitHubEvent
- App.tsx
- Glossary
- worker.ts
- Finding Animation Opportunities
- animate.md
- Handle `generate`
- Tasks.tsx
- Generate Report
- optimize.md
- manifest.json
- Simplify the Design
- Hardening Dimensions
- Visualize: Direction Comps & Asset Production
- inline-ignores.mjs
- clarify.md
- critique.md
- Nielsen's 10 Heuristics
- Generate Combined Critique Report
- New visual work
- polish.md
- quieter.md
- Init flow
- The list
- Jarvis: AI-Powered Voice Assistant & Productivity Suite
- Design Engineering
- Common Cognitive Load Violations
- Operate mode depth (and Read notes)
- Shape
- client/vercel.json
- Component Building Principles
- CSP detection (first-time only)
- Persona-Based Design Testing
- expandScanTargets
- Extract Flow
- next-themes
- OmniRoute Integration Skill
- browser-script-parts.mjs
- @radix-ui/react-slot
- Cognitive Load Assessment
- dotenv
- The Animation Decision Framework
- clip-path for Animation
- Performance Rules
- Gesture and Drag Interactions
- groq-sdk
- nodemailer
- impeccable/SKILL.md
- @prisma/client
- CSS Transform Mastery
- The Sonner Principles (Building Loved Components)
- Spring Animations
- @types/web-push
- Core Philosophy
- Debugging Animations
- Heuristics Scoring Guide
- React + TypeScript + Vite
- cn
- detect-text.mjs
- rules/graphify.md
- workflows/graphify.md
- vercel.json
- bullmq
- class-variance-authority
- react-dom
- react-hook-form
- sonner
- ioredis
- lucide-react
- multer
- express
- helmet
- jsonwebtoken
- prisma
- socket.io
- @types/express
- @types/multer
- @types/nodemailer
- @types/socket.io
- typescript
- web-push
- winston
- zod

## God Nodes (most connected - your core abstractions)
1. `parseAnyColor()` - 36 edges
2. `runHook()` - 36 edges
3. `collectBrowserFindings()` - 35 edges
4. `parseAnyColor()` - 33 edges
5. `setLiveState()` - 29 edges
6. `initGlobalBar()` - 29 edges
7. `detectHtml()` - 28 edges
8. `connectSSE()` - 28 edges
9. `el()` - 27 edges
10. `resumeSession()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `collect()` --indirect_call--> `extractPlatform()`  [INFERRED]
  .agents/skills/impeccable/scripts/doctor.mjs → .agents/skills/impeccable/scripts/context.mjs
- `collect()` --indirect_call--> `parseDesignMd()`  [INFERRED]
  .agents/skills/impeccable/scripts/doctor.mjs → .agents/skills/impeccable/scripts/lib/design-parser.mjs
- `enableInlineEdit()` --indirect_call--> `own()`  [INFERRED]
  .agents/skills/impeccable/scripts/live-browser.js → .agents/skills/impeccable/scripts/live-browser-dom.js
- `layoutFlowChildren()` --indirect_call--> `pickable()`  [INFERRED]
  .agents/skills/impeccable/scripts/live-browser.js → .agents/skills/impeccable/scripts/live-browser-dom.js
- `Settings()` --indirect_call--> `getStoredVoiceSettings()`  [INFERRED]
  client/src/pages/Settings.tsx → client/src/lib/voiceManager.ts

## Import Cycles
- None detected.

## Communities (210 total, 40 thin omitted)

### Community 0 - "live-browser.js"
Cohesion: 0.03
Nodes (127): acceptedDomAlreadyClean(), addManualContextText(), applyGlobalBarLabelState(), applyPlaceholderSizingStyles(), applySvelteComponentVariantStyle(), bufferToBase64(), buildCollapsible(), buildColorModels() (+119 more)

### Community 1 - "checks.mjs"
Cohesion: 0.03
Nodes (125): ANIMATION_VALUE_KEYWORDS, borderColorsFromStyle(), borderWidthsFromStyle(), checkBorders(), checkClippedOverflow(), checkCreamPalette(), checkEdgeFlushCardsDOM(), checkElementBlinkingCursorDOM() (+117 more)

### Community 2 - "react"
Cohesion: 0.17
Nodes (19): AuthQuantumShowcase(), FormControl, FormDescription, FormField(), FormFieldContext, FormFieldContextValue, FormItem, FormItemContext (+11 more)

### Community 3 - "connectSSE"
Cohesion: 0.06
Nodes (81): applyOriginalAttrsToSvelteAnchor(), applyParamDefaults(), applyParamValue(), applySavedSessionMeta(), buildInsertPlaceholderSnapshotFromDom(), buildParamsPanel(), checkpointPayload(), clampVariantIndex() (+73 more)

### Community 4 - "index.mjs"
Cohesion: 0.06
Nodes (68): addBrowserFindings(), addVisualContrastFindings(), addVisualContrastResult(), analyzeVisualContrast(), analyzeVisualContrastCandidate(), blendRgba(), browserColorsClose(), browserDesignSystemConfig() (+60 more)

### Community 5 - "detect-antipatterns-browser.js"
Cohesion: 0.05
Nodes (62): browserColorsClose(), browserDesignSystemConfig(), browserHasDirectText(), browserPrimaryFont(), browserRadiusTokens(), browserSampleText(), buildSelectorSegment(), checkBrowserDesignSystemSources() (+54 more)

### Community 6 - "setLiveState"
Cohesion: 0.08
Nodes (71): abortSvelteComponentInjection(), applyEditing(), buildLocatorForLeaf(), buildPickedAnchorSnapshot(), cancelEditing(), cancelEditingToPicking(), cancelInsertConfigure(), cleanup() (+63 more)

### Community 7 - "initGlobalBar"
Cohesion: 0.10
Nodes (33): agentHasWorkInFlight(), agentStatusText(), barPaletteForTheme(), brandMarkSvg(), buildDesignHeader(), buildSteerProcessingDots(), designPanelCss(), detectPageTheme() (+25 more)

### Community 8 - "live-inject.mjs"
Cohesion: 0.06
Nodes (66): appendOriginToDirective(), applyNuxtLiveAdapter(), buildLiveScriptSrc(), buildNuxtPlugin(), buildTagBlock(), commentClose(), commentOpen(), CONFIG_PATH (+58 more)

### Community 9 - "design-system.mjs"
Cohesion: 0.08
Nodes (62): addClampEndpoints(), addColorObject(), addDesignColor(), addFontSizeStep(), addRoundedScale(), addRoundedToken(), addSidecarColors(), addSidecarRadii() (+54 more)

### Community 10 - "css-cascade.mjs"
Cohesion: 0.06
Nodes (33): applyStaticDeclaration(), buildBorderOverrideMap(), parseShorthand(), resolveVar(), buildStaticStyleMap(), buildStaticWindow(), collectStaticCssRules(), compareStaticPriority() (+25 more)

### Community 11 - "context.mjs"
Cohesion: 0.05
Nodes (70): appendAutonomyCounterDirective(), appendDetectorFallback(), appendImageGenDirective(), appendSubagentAuthorizationDirective(), appendSurfaceBriefContext(), automaticHookMode(), buildMissingTargetDirective(), buildResolvedContextDirective() (+62 more)

### Community 12 - "modern-screenshot.umd.js"
Cohesion: 0.09
Nodes (55): ae(), be(), bt(), Ce(), s(), Ct(), de(), dt() (+47 more)

### Community 13 - "manual-apply.mjs"
Cohesion: 0.09
Nodes (49): addOpToManualApplyChunk(), APPLY_EVENT_HARD_TIMEOUT_MS, APPLY_EVENT_SOFT_DEADLINE_MS, buildManualApplyAgentAction(), clearManualApplyTransaction(), collectManualApplyFiles(), compactManualApplyBatch(), compactManualApplyCandidates() (+41 more)

### Community 14 - "hook-lib.mjs"
Cohesion: 0.07
Nodes (55): ACK_EXTS, ADVISORY_RULES, applyConfigSource(), applyDetectorConfigSource(), clampByte(), cleanIgnoreValueDisplay(), cloneDefaultConfig(), CO_SCAN_STYLE_NAMES (+47 more)

### Community 15 - "el"
Cohesion: 0.08
Nodes (51): actionLabel(), applyConfigureBarChrome(), bindConfigureCountPillTooltip(), bindConfigureInlineControlHover(), bindConfigureModifierPillHover(), buildConfigureActionControl(), buildConfigureCountControl(), buildConfigureRow() (+43 more)

### Community 16 - "live-commit-manual-edits.mjs"
Cohesion: 0.10
Nodes (49): allEntryIds(), argVal(), buildRepairBatch(), candidatesForEntry(), changedFilesSinceSnapshot(), clearAppliedEntries(), collectApplyOwnedFiles(), collectRollbackFiles() (+41 more)

### Community 17 - "detect-antipatterns.mjs"
Cohesion: 0.09
Nodes (41): confirm(), detectCli(), dim(), fileUrlToLocalPath(), formatAdvisorySection(), formatFindings(), formatFindingsBody(), formatFindingSummary() (+33 more)

### Community 18 - "impeccable-config.mjs"
Cohesion: 0.10
Nodes (47): applyDetectionConfigSource(), clampByte(), cleanIgnoreValueDisplay(), cloneDetectionConfig(), cloneRawDetectionConfig(), colorIgnoreKey(), DEFAULT_DETECTION_CONFIG, DETECTOR_CONFIG_KEYS (+39 more)

### Community 19 - "initPageChat"
Cohesion: 0.08
Nodes (51): armPageChatForTyping(), attachSteerFocusDebug(), attachSteerFocusGuard(), clearSteerAwaitTimer(), clearSteerFocusRecoverTimer(), collapsePageChat(), expandPageChat(), finishVoiceSession() (+43 more)

### Community 20 - "svelte-component.mjs"
Cohesion: 0.09
Nodes (47): applyLegacyDeferredAcceptsOnStartup(), appendCssToSvelteStyle(), appendSanitizedCssRule(), applyDeferredSvelteComponentAccepts(), bakeParamValuesInCss(), buildInsertVariantStub(), buildPropContract(), buildPropsScript() (+39 more)

### Community 21 - "live-server.mjs"
Cohesion: 0.08
Nodes (56): eventPriority(), selectAvailablePendingEvent(), acknowledgePendingEvent(), activeSessionSummaries(), agentPollingConnected(), annotRoot, args, broadcast() (+48 more)

### Community 22 - "staleness.mjs"
Cohesion: 0.15
Nodes (24): DESIGN_SIDECAR_SCHEMA_VERSION, PRODUCT_DEPRECATED_SECTIONS, PRODUCT_SCHEMA_VERSION, PRODUCT_V4_SECTIONS, productStampLine(), readProductSchemaVersion(), readSidecarSchemaVersion(), stampProductSchema() (+16 more)

### Community 23 - "hook-admin.mjs"
Cohesion: 0.10
Nodes (45): ACTIONS, addIgnoreFile(), addIgnoreRule(), addIgnoreValue(), DETECTOR_CONFIG_KEYS, detectorSection(), fileHasImpeccableHookMarker(), HOOK_MANIFEST_TARGETS (+37 more)

### Community 24 - "live-wrap.mjs"
Cohesion: 0.13
Nodes (37): hasGeneratedHeader(), HEADER_MARKERS, isGeneratedFile(), isGitIgnored(), argVal(), buildInsertWrapperLines(), computeInsertLine(), INSERT_POSITIONS (+29 more)

### Community 25 - "insert-ui.mjs"
Cohesion: 0.07
Nodes (25): FORBIDDEN_MANUAL_EDIT_TEXT_CHARS, INSERT_POSITIONS, isValidId(), isValidVariantId(), validateAnnotationFields(), validateEvent(), validateInsertGenerate(), validateManualEditEvent() (+17 more)

### Community 26 - "doctor.md"
Cohesion: 0.08
Nodes (21): Adaptation Strategies, Assess Adaptation Challenge, Implement & Verify, Orientation & foldables, Phone → Tablet (iPad / large screens), Platform → platform (iOS ↔ Android), Web → native (porting a website or web app), Android platform (+13 more)

### Community 27 - "hook-before-edit.mjs"
Cohesion: 0.11
Nodes (39): allow(), bumpCursorDenial(), deny(), detectProposedHtml(), done(), escapeRegExp(), findingSignature(), firstMatch() (+31 more)

### Community 28 - "live-accept.mjs"
Cohesion: 0.12
Nodes (38): acceptCli(), acceptReceiptPath(), argVal(), buildAcceptedWrappedSource(), buildCarbonizeReplacement(), decodeHtmlAttr(), deindentContent(), detectCommentSyntax() (+30 more)

### Community 29 - "concept-seed.mjs"
Cohesion: 0.11
Nodes (34): API_BASE, API_TIMEOUT_MS, apiBudgetMs(), fetchRoll(), here, loadLocal(), localStates, pingChosen() (+26 more)

### Community 30 - "scanCssTextForPulsingDot"
Cohesion: 0.11
Nodes (35): checkColors(), checkElementAIPaletteDOM(), checkElementGlow(), checkGlow(), checkHoverContrast(), checkHtmlPatterns(), collectCssCustomProps(), collectMarqueeKeyframes() (+27 more)

### Community 31 - "design-parser.mjs"
Cohesion: 0.15
Nodes (33): buildColor(), CANONICAL_SECTIONS, collectBullets(), collectColorValues(), collectParagraphs(), detectFormat(), extractColors(), extractComponents() (+25 more)

### Community 32 - "detect-html.mjs"
Cohesion: 0.10
Nodes (23): mergeDesignSystemFindings(), runTextContentAnalyzers(), collectStaticCssText(), checkStaticPageTypography(), detectHtml(), STATIC_ELEMENT_RULES, checkNumberedSectionLabels(), checkNumberedSectionLabelsDOM() (+15 more)

### Community 33 - "live-copy-edit-agent.mjs"
Cohesion: 0.14
Nodes (31): applyMockWrites(), buildCopyEditBatchPrompt(), checkFrameworkSourceSyntax(), chooseCopyEditAgent(), COMMAND_AUTH_CACHE, commandAuthed(), commandExists(), compactBatchForPrompt() (+23 more)

### Community 34 - "scanCssTextForPulsingDot"
Cohesion: 0.11
Nodes (36): checkColors(), checkElementAIPaletteDOM(), checkElementGlow(), checkElementGlowDOM(), checkGlow(), checkHoverContrast(), checkHtmlPatterns(), collectCssCustomProps() (+28 more)

### Community 35 - "live-poll.mjs"
Cohesion: 0.14
Nodes (29): completionAckForAcceptResult(), completionTypeForAcceptResult(), PREVIEW_MODES_WITHOUT_SOURCE_MARKERS, augmentEventWithAcceptHandling(), buildAcceptScriptArgs(), buildPollReplyPayload(), completeAcceptHandling(), DEFAULT_EVENT_LEASE_MS (+21 more)

### Community 36 - "dependencies"
Cohesion: 0.13
Nodes (15): bcrypt, cors, express-rate-limit, dependencies, bcrypt, cors, express-rate-limit, @types/bcrypt (+7 more)

### Community 37 - "parseAnyColor"
Cohesion: 0.16
Nodes (26): checkCreamPalette(), checkElementColors(), checkElementColorsDOM(), checkElementGlowDOM(), checkElementHoverContrast(), checkElementIconTile(), checkElementIconTileDOM(), checkIconTile() (+18 more)

### Community 38 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowImportingTsExtensions, allowSyntheticDefaultImports, baseUrl, esModuleInterop, ignoreDeprecations, isolatedModules, jsx (+20 more)

### Community 39 - "critique-storage.mjs"
Cohesion: 0.17
Nodes (22): coerceSlug(), listSnapshotsForSlug(), main(), nowFilenameStamp(), parseFrontmatter(), readLatestSnapshot(), readTrend(), serializeFrontmatter() (+14 more)

### Community 40 - "runHook"
Cohesion: 0.13
Nodes (30): cursorBlockMessage(), appendDesignSystemNote(), bumpEditCount(), clampGroupedToBudget(), clampToBudget(), dedupeAgainstCache(), depthIsSet(), designSystemOptions() (+22 more)

### Community 41 - "resolveLengthPx"
Cohesion: 0.14
Nodes (20): checkElementHeroEyebrow(), checkElementHeroEyebrowDOM(), checkElementQualityDOM(), checkHeroEyebrow(), checkNumberedSectionLabels(), checkNumberedSectionLabelsDOM(), checkNumberedSectionLabelsFromDoc(), checkRepeatedSectionKickers() (+12 more)

### Community 42 - "manual-edit-routes.mjs"
Cohesion: 0.18
Nodes (22): args, buffer, cwd, pageUrlFilter, remaining, compactManualLogText(), summarizeManualApplyFailures(), summarizeManualDiagnostics() (+14 more)

### Community 43 - "live-manual-edit-evidence.mjs"
Cohesion: 0.15
Nodes (25): analyzeSourceHint(), buildCandidatesForOp(), buildContextHintsByRef(), collectSearchFiles(), countOps(), decodeBasicHtml(), escapeRegExp(), findContextMatches() (+17 more)

### Community 44 - "showToast"
Cohesion: 0.16
Nodes (28): clearStoredManualApplyState(), dismissToast(), fetchPendingCount(), handleManualEditActivity(), hidePendingApplyDock(), manualApplyLoadingText(), manualApplyStateKey(), manualEditEventForCurrentPage() (+20 more)

### Community 45 - "routes/index.ts"
Cohesion: 0.11
Nodes (20): limiter, eventController, eventSchema, pushController, reminderController, taskController, taskSchema, telegramController (+12 more)

### Community 46 - "impeccable-paths.mjs"
Cohesion: 0.15
Nodes (24): CRITIQUE_DIR, firstExisting(), getDesignSidecarCandidates(), getDesignSidecarPath(), getImpeccableDir(), getLegacyLiveConfigPath(), getLegacyLiveServerPath(), getLiveAnnotationsDir() (+16 more)

### Community 47 - "captureElementToBlob"
Cohesion: 0.12
Nodes (21): averageRgb01(), captureAndEmit(), captureChromeNodes(), captureElementFromRenderedAncestor(), captureElementToBlob(), compileShader(), cssColorToRgb01(), dominantRgb01() (+13 more)

### Community 48 - "pushController.ts"
Cohesion: 0.20
Nodes (10): config, envSchema, parsedEnv, subscribeSchema, unsubscribeSchema, EmailFallbackResult, getTransporter(), sendReminderFallbackEmail() (+2 more)

### Community 49 - "onAnnotDown"
Cohesion: 0.15
Nodes (21): applyPlaceholderDimensions(), beginEditPin(), buildAnnotationsForCapture(), buildPinElement(), cancelEditingPin(), clampPlaceholderSize(), finalizeEditingPin(), initAnnotOverlay() (+13 more)

### Community 50 - "loadContext"
Cohesion: 0.16
Nodes (18): hasVisualImplementation(), loadContext(), parseCliOptions(), resolveProjectRoot(), getLegacyLiveAnnotationsDir(), parseTargetOptions(), parseTargetPath(), TargetArgError (+10 more)

### Community 51 - "collectBrowserFindings"
Cohesion: 0.16
Nodes (20): browserFindingsFromMap(), checkBorders(), checkEdgeFlushCardsDOM(), checkElementBlinkingCursorDOM(), checkElementBorders(), checkElementBordersDOM(), checkElementPseudoStripeDOM(), checkElementTextOverflowDOM() (+12 more)

### Community 52 - "readLiveServerInfo"
Cohesion: 0.21
Nodes (17): readLiveServerInfo(), completeCli(), completeThroughServer(), parseArgs(), readServerInfo(), collectManualApplyFiles(), manualApplyReplyCommand(), manualApplyResumeHint() (+9 more)

### Community 53 - "devDependencies"
Cohesion: 0.10
Nodes (21): autoprefixer, devDependencies, autoprefixer, oxlint, postcss, tailwindcss, @types/node, @types/react (+13 more)

### Community 54 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 55 - "doctor.mjs"
Cohesion: 0.13
Nodes (30): applyFixes(), cli(), collect(), parseArgs(), readProjectRootPatterns(), rel(), renderText(), safeRead() (+22 more)

### Community 56 - "server/package.json"
Cohesion: 0.22
Nodes (8): devDependencies, tsx, vitest, main, name, version, tsx, vitest

### Community 57 - "Web 3D Integration Patterns"
Cohesion: 0.07
Nodes (28): 1. Animation Conflicts, 1. Render Loop Optimization, 1. Scroll-Driven Camera Movement, 1. Zustand for Global 3D State, 2. Gesture-Driven 3D Manipulation, 2. On-Demand Rendering (R3F), 2. State Synchronization Issues, 3. Memory Leaks from Abandoned Animations (+20 more)

### Community 58 - "localCommand.ts"
Cohesion: 0.17
Nodes (15): assistantController, groq, GroqService, TOOLS, applyTime(), cleanCommand(), isValidDate(), parseDateTime() (+7 more)

### Community 59 - "createLiveBrowserSessionState"
Cohesion: 0.20
Nodes (14): createLiveBrowserSessionState(), clearHandled(), clearScrollY(), clearSession(), isHandled(), loadSession(), markHandled(), nextCheckpointRevision() (+6 more)

### Community 60 - "components.json"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 61 - "context-signals.mjs"
Cohesion: 0.20
Nodes (14): escapeRegExp(), extractPlatform(), extractSectionValue(), cli(), COMMON_DEV_PORTS, devServerSignals(), gatherSignals(), gitSignals() (+6 more)

### Community 62 - "analyzeVisualContrastCandidate"
Cohesion: 0.12
Nodes (22): addBrowserFindings(), addVisualContrastFindings(), addVisualContrastResult(), analyzeVisualContrast(), analyzeVisualContrastCandidate(), blendRgba(), clampByte(), clearOverlays() (+14 more)

### Community 63 - "sampleCssBackground"
Cohesion: 0.22
Nodes (14): firstCssUrl(), getLayerValue(), loadVisualContrastImage(), parseObjectPosition(), parsePositionPair(), parsePositionToken(), pickWorstContrastColor(), pointToImageSource() (+6 more)

### Community 64 - "serve-question.mjs"
Cohesion: 0.18
Nodes (13): answerFile(), esc(), loadRound(), localImages, nextFile(), page(), payloadPath, portArg (+5 more)

### Community 65 - "checkHeadingRhythmDOM"
Cohesion: 0.20
Nodes (15): checkHeadingRhythmDOM(), clusterTop(), edgeAbove(), edgeBelow(), hasOwnTopBoundary(), insideSmallCard(), isVisibleFlow(), overlapsX() (+7 more)

### Community 66 - "checkHeadingRhythmDOM"
Cohesion: 0.62
Nodes (7): checkHeadingRhythmDOM(), clusterTop(), edgeAbove(), edgeBelow(), hasOwnTopBoundary(), isVisibleFlow(), overlapsX()

### Community 67 - "generate-image.mjs"
Cohesion: 0.20
Nodes (12): crc32(), hash32(), hslToRgb(), out, palette(), pngChunk(), pngFake(), promptFile (+4 more)

### Community 68 - "createLiveBrowserDomHelpers"
Cohesion: 0.19
Nodes (10): createLiveBrowserDomHelpers(), cssId(), liveUiRoot(), makeFrozenAnchor(), own(), pickable(), rectIsUsableAnchor(), uiAppend() (+2 more)

### Community 69 - "dependencies"
Cohesion: 0.10
Nodes (21): animejs, axios, dependencies, animejs, axios, clsx, date-fns, react (+13 more)

### Community 70 - "session-store.mjs"
Cohesion: 0.19
Nodes (12): getLegacyLiveSessionsDir(), safeSessionId(), applyEvent(), baseSnapshot(), COMPLETED_PHASES, getReadableJournalPath(), GENERATION_FENCED_PHASES, getJournalPath() (+4 more)

### Community 71 - "pin.mjs"
Cohesion: 0.22
Nodes (11): CODEX_HARNESSES, commandPrefixForSkillsDir(), __dirname, findHarnessDirs(), generatePinnedSkill(), HARNESS_DIRS, loadCommandMetadata(), pin() (+3 more)

### Community 72 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, outDir, resolveJsonModule, rootDir, skipLibCheck (+4 more)

### Community 73 - "colorize.md"
Cohesion: 0.25
Nodes (7): Apply at system scale, Audit before choosing, Choose a strategy, Contrast and perception, Live-mode signature params, Verify, Visitor mode

### Community 74 - "telegramService.ts"
Cohesion: 0.33
Nodes (9): settingsSchema, testSchema, escapeHtml(), getTelegramBotToken(), isTelegramConfigured(), sendTelegramMessage(), sendTelegramReminder(), TelegramSendResult (+1 more)

### Community 75 - "Animation Standards Reference"
Cohesion: 0.07
Nodes (25): Aggressive Escalation Triggers, Guidelines, Operating Posture, Part 1 — Findings table (REQUIRED), Part 2 — Verdict (REQUIRED), Remedial Preference Hierarchy, Required Output Format, Reviewing Animations (+17 more)

### Community 76 - "generation-preflight.mjs"
Cohesion: 0.30
Nodes (10): buildGenerationPreflight(), compactError(), execFileAsync, insertTarget(), normalizeTarget(), replaceTarget(), runGenerationPreflight(), sourceResolutionCache (+2 more)

### Community 77 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, prisma:generate, prisma:migrate, prisma:studio, start, test

### Community 78 - "detect-csp.mjs"
Cohesion: 0.20
Nodes (10): detectCsp(), INLINE_HEADER_SIGNALS, LAYOUT_EXTS, MONOREPO_HELPER_SIGNALS, NUXT_ROUTE_RULES_SIGNALS, NUXT_SECURITY_SIGNALS, SCAN_EXTS, SKIP_DIRS (+2 more)

### Community 79 - "checkTextOcclusionDOM"
Cohesion: 0.22
Nodes (11): checkTextOcclusionDOM(), clippedByInset(), clippedByRect(), elementDirectText(), expandBoxShorthand(), firstMetricLengthPx(), isLayeredElement(), isOpaqueDecoratedBox() (+3 more)

### Community 80 - "template-extensions.mjs"
Cohesion: 0.18
Nodes (14): IMPECCABLE_DIR, extensionCache, LIVE_TEMPLATE_EXTENSIONS, matchesTemplateExtension(), mergeExtensions(), normalizeExtensionEntries(), readLiveTemplateExtensions(), resolveLiveTemplateExtensions() (+6 more)

### Community 81 - "palette.mjs"
Cohesion: 0.24
Nodes (7): args, buildWeights(), hashUnit(), pickSeed(), seed, SEEDS, weightedPick()

### Community 82 - "plugins"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 83 - "authController.ts"
Cohesion: 0.36
Nodes (8): login(), loginSchema, me(), register(), registerSchema, comparePassword(), generateToken(), hashPassword()

### Community 84 - "staleness-notice.mjs"
Cohesion: 0.38
Nodes (9): appendStalenessDirective(), buildStalenessDirective(), cachePath(), filterFreshFindings(), pruneCache(), readCache(), readJson(), stalenessCheckDisabled() (+1 more)

### Community 85 - "detect-url.mjs"
Cohesion: 0.21
Nodes (18): detectUrl(), measureContentHiddenAfterReveal(), runVisualContrastFallback(), serializeDesignSystemForBrowser(), captureVisualContrastCandidate(), compareScreenshotContrast(), sanitizeScreenshotClip(), createDetectorProfile() (+10 more)

### Community 86 - "prisma.ts"
Cohesion: 0.27
Nodes (6): analyticsController, reminderSchema, reminderUpdateSchema, globalForPrisma, prisma, router

### Community 87 - "ui-core.mjs"
Cohesion: 0.29
Nodes (8): appendStyleToLiveUiRoot(), appendToLiveUiRoot(), escapeCssIdent(), getLiveUiElementById(), LIVE_CHROME_MOUNT_CONTRACT, LIVE_UI_COMPONENT_IDS, LIVE_UI_SURFACES, resolveLiveUiRoot()

### Community 88 - "client/package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 89 - "discoverTargetCandidates"
Cohesion: 0.21
Nodes (16): directChildDirs(), discoverRootsForPattern(), discoverTargetCandidates(), expandSimplePattern(), findTargetExample(), isExcludedByWorkspacePattern(), isIgnoredWorkspaceDiscoveryDir(), isSelectableCandidate() (+8 more)

### Community 90 - "package.json"
Cohesion: 0.10
Nodes (19): dependencies, @hookform/resolvers, react-hook-form, @hookform/resolvers, react-hook-form, name, private, scripts (+11 more)

### Community 91 - "checkQuality"
Cohesion: 0.16
Nodes (16): borderColorsFromStyle(), borderWidthsFromStyle(), checkElementGptBorderShadow(), checkElementGptBorderShadowDOM(), checkGptThinBorderWideShadow(), checkQuality(), colorsNearlyMatch(), cssColorAlpha() (+8 more)

### Community 92 - "iOS platform"
Cohesion: 0.25
Nodes (8): Color & materials, Components & controls, iOS platform, Layout & structure, Motion, The iOS slop test, Touch targets, Typography

### Community 93 - "$impeccable hooks"
Cohesion: 0.33
Nodes (6): Constraints, Failure modes, Flow, $impeccable hooks, Intentional findings, Routing

### Community 94 - "resolveLiveInjectionAnchor"
Cohesion: 0.62
Nodes (7): elementMatchesOriginalMarkup(), findLiveElementForOriginalMarkup(), findLiveElementFromAnchorSnapshot(), isUsableInjectionAnchor(), normalizeElementClassName(), parseOriginalMarkupElement(), resolveLiveInjectionAnchor()

### Community 96 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, baseUrl, ignoreDeprecations, paths, files, references

### Community 97 - "Responsive Design"
Cohesion: 0.08
Nodes (25): Assess Adaptation Challenge, Breakpoints: Content-Driven, Content Adaptation, Desktop Adaptation (Mobile → Desktop), Detect Input Method, Not Just Screen Size, Email Adaptation (Web → Email), Implement Adaptations, Layout Adaptation Patterns (+17 more)

### Community 98 - "live.md"
Cohesion: 0.08
Nodes (24): Apply, Live-mode signature params, Set the spatial thesis, Two isolated assessments, Verify, Visitor mode, Cleanup, Exit (+16 more)

### Community 99 - "detect.mjs"
Cohesion: 0.50
Nodes (3): candidates, detectorPath, __dirname

### Community 100 - "hook.mjs"
Cohesion: 0.83
Nodes (3): isStopEvent(), main(), readStdin()

### Community 101 - "VoiceAssistant.tsx"
Cohesion: 0.16
Nodes (19): QuantumVoiceCore3D(), QuantumVoiceCore3DProps, ChatMessage, VoiceAssistant(), getAudioContext(), playSuccessChime(), playWakeChime(), DEFAULT_VOICE_SETTINGS (+11 more)

### Community 105 - "Settings.tsx"
Cohesion: 0.47
Nodes (9): Settings(), getActiveSubscription(), getNotificationPermission(), isPushSupported(), registerServiceWorker(), subscribeToPush(), triggerTestPush(), unsubscribeFromPush() (+1 more)

### Community 106 - "Scan mode (approach C: auto-extract, then confirm descriptive language)"
Cohesion: 0.15
Nodes (13): Component translation rules, Narrative mapping, Scan mode (approach C: auto-extract, then confirm descriptive language), Schema, Step 1: Find the design assets, Step 2: Auto-extract what can be auto-extracted, Step 2b: Stage the frontmatter, Step 3: Ask the user for qualitative language (+5 more)

### Community 107 - "Animation Audit Playbook"
Cohesion: 0.09
Nodes (21): 1. Purpose & frequency, 2. Easing & duration, 3. Physicality & origin, 4. Interruptibility, 5. Performance, 6. Accessibility, 7. Cohesion & tokens, 8. Missed opportunities (+13 more)

### Community 109 - "syncEditBadgeHitProxies"
Cohesion: 0.27
Nodes (10): bindEditBadgeProxy(), editBadgeProxyTargets(), initEditBadge(), initEditBadgeHitProxies(), positionEditBadge(), proxyMouseEvent(), setImportantStyle(), styleEditBadgeProxy() (+2 more)

### Community 110 - "typeset.md"
Cohesion: 0.09
Nodes (20): 1. Accessibility (VoiceOver / TalkBack), 2. Performance, 3. Appearance & Theming, 4. Platform Conformance (CRITICAL), 5. Adaptivity, Audit Health Score, Detailed Findings by Severity, Diagnostic Scan (+12 more)

### Community 112 - "onboard.md"
Cohesion: 0.09
Nodes (22): Assess Onboarding Needs, Context Over Ceremony, Contextual Help, Design Onboarding Experiences, Documentation & Help, Empty State Design, Feature Discovery & Adoption, Guided Tours & Walkthroughs (+14 more)

### Community 114 - "Apple Design"
Cohesion: 0.10
Nodes (20): 10. Gesture design details (the "feel" checklist), 11. Frame-level smoothness, 12. Materials & depth — translucency conveys hierarchy, 13. Multimodal feedback — motion + sound + haptics, 14. Reduced motion & accessibility, 15. Typography — optical sizing, tracking, leading, 16. Design foundations — the eight principles, 17. Process (+12 more)

### Community 117 - "The Toolkit"
Cohesion: 0.10
Nodes (20): Animate complex properties, Assess What "Extraordinary" Means Here, For data-heavy interfaces, For functional UI, For performance-critical UI, For visual/marketing surfaces, Implement with Discipline, Interact with the device (+12 more)

### Community 119 - "Workflow"
Cohesion: 0.10
Nodes (18): Behavior contract, Markup, Reference wiring, Rules, Styles, The Picker, Hard Rules, Invocation Variants (+10 more)

### Community 125 - "bolder.md"
Cohesion: 0.33
Nodes (5): Before you finish, Scope is sovereign, The amplification, The skeleton test, Why it reads flat

### Community 126 - "normalizeGitHubEvent"
Cohesion: 0.38
Nodes (7): applyPatchText(), envProjectDir(), looksLikeApplyPatch(), normalizeGitHubEvent(), normalizeHookEvent(), parseGitHubToolArgs(), resolveProjectCwd()

### Community 127 - "App.tsx"
Cohesion: 0.14
Nodes (16): App(), ProtectedRoute(), DashboardLayout(), Header(), navItems, Sidebar(), SpatialConstellationBackground(), Dashboard() (+8 more)

### Community 128 - "Glossary"
Cohesion: 0.11
Nodes (17): Animation Vocabulary, Easing — how speed changes over an animation, Entrances & Exits — how elements appear and disappear, Examples, Feedback & Interaction — responding to the user's actions, Glossary, Instructions, Looping & Ambient Motion — animations that run on their own (+9 more)

### Community 129 - "worker.ts"
Cohesion: 0.15
Nodes (20): app, io, server, sendPushNotificationToUser(), emitToUser(), initSocket(), isUserConnected(), calculateNextRecurrence() (+12 more)

### Community 130 - "Finding Animation Opportunities"
Cohesion: 0.12
Nodes (15): 1. Frequency — how often will a user see this?, 2. Purpose — why does this animate?, 3. Speed — can it stay inside budget?, 4. Function — does motion help or hinder here?, Finding Animation Opportunities, Hard Rules, Operating Posture, Part 1 — Opportunities table (+7 more)

### Community 131 - "animate.md"
Cohesion: 0.12
Nodes (14): Accessibility and control, Choose material by meaning, Find the job, Implement to the runtime, Set the motion thesis, Timing and easing, Verify, Visitor mode (+6 more)

### Community 132 - "Handle `generate`"
Cohesion: 0.12
Nodes (16): 1. Read the screenshot (if present), 2. Wrap the element, 3. Load the action's reference, 4. Plan three variants: identity first, then mode, then axes, 5. Apply the freeform prompt (if present), 6. Deliver variants, 7. Parameters (composition-sized, 0–4 per variant), 8. Signal done (+8 more)

### Community 133 - "Tasks.tsx"
Cohesion: 0.22
Nodes (11): Button, ButtonProps, buttonVariants, Input, Calendar(), Event, Reminder, Reminders() (+3 more)

### Community 134 - "Generate Report"
Cohesion: 0.13
Nodes (14): 1. Accessibility (A11y), 2. Performance, 3. Theming, 4. Responsive Design, 5. Implementation Integrity (CRITICAL), Audit Health Score, Detailed Findings by Severity, Diagnostic Scan (+6 more)

### Community 135 - "optimize.md"
Cohesion: 0.14
Nodes (13): Animation Performance, Assess Performance Issues, Core Web Vitals Optimization, Cumulative Layout Shift (CLS < 0.1), First Input Delay (FID < 100ms) / INP (< 200ms), Largest Contentful Paint (LCP < 2.5s), Loading Performance, Network Optimization (+5 more)

### Community 136 - "manifest.json"
Cohesion: 0.13
Nodes (14): background_color, categories, description, display, icons, name, orientation, scope (+6 more)

### Community 137 - "Simplify the Design"
Cohesion: 0.17
Nodes (11): Assess Current State, Code Simplification, Content Simplification, Document Removed Complexity, Information Architecture, Interaction Simplification, Layout Simplification, Plan Simplification (+3 more)

### Community 138 - "Hardening Dimensions"
Cohesion: 0.17
Nodes (11): Accessibility Resilience, Assess Hardening Needs, Edge Cases & Boundary Conditions, Error Handling, Hardening Dimensions, Input Validation & Sanitization, Internationalization (i18n), Performance Resilience (+3 more)

### Community 139 - "Visualize: Direction Comps & Asset Production"
Cohesion: 0.33
Nodes (5): Generate three compositional options, Inventory implementation fidelity, One approval point, Produce only the assets the build needs, Visualize: Direction Comps & Asset Production

### Community 140 - "inline-ignores.mjs"
Cohesion: 0.40
Nodes (9): addRules(), applyInlineIgnores(), getSet(), hasDirectives(), isInlineIgnored(), normalizeRule(), parseInlineIgnores(), parseRuleList() (+1 more)

### Community 141 - "clarify.md"
Cohesion: 0.18
Nodes (10): Actions and navigation, Audit the language, Errors and permissions, Forms, Help and instructional text, Loading, empty, and success states, Rewrite by function, Set the message hierarchy (+2 more)

### Community 142 - "critique.md"
Cohesion: 0.18
Nodes (10): Action Summary, Ask the User, Assessment A: Design Review, Assessment B: Detector + Browser Evidence, Assessment Orchestration, Hard Invariants, Persist the Snapshot, Purpose (+2 more)

### Community 143 - "Nielsen's 10 Heuristics"
Cohesion: 0.18
Nodes (11): 10. Help and Documentation, 1. Visibility of System Status, 2. Match Between System and Real World, 3. User Control and Freedom, 4. Consistency and Standards, 5. Error Prevention, 6. Recognition Rather Than Recall, 7. Flexibility and Efficiency of Use (+3 more)

### Community 144 - "Generate Combined Critique Report"
Cohesion: 0.18
Nodes (11): Design Health Score, Design Specificity Verdict, Generate Combined Critique Report, Minor Observations, Overall Impression, Persona Red Flags, Priority Issues, Questions to Consider (+3 more)

### Community 145 - "New visual work"
Cohesion: 0.18
Nodes (11): 1. Decide what is already true, 2. Ask what will change the work, 3. Choose the right amount of invention, 4. Commit the world, 5. Record the decision, 6. Build with full commitment, 7. Inspect and finish, Create a whole surface inside an established world (+3 more)

### Community 146 - "polish.md"
Cohesion: 0.18
Nodes (10): 1. Establish the system, 2. Gather the evidence, 3. Triage, 4. Polish the whole path, 5. Verify and finish, Color, imagery, and icons, Content and code, Flow and hierarchy (+2 more)

### Community 147 - "quieter.md"
Cohesion: 0.18
Nodes (10): Assess Current State, Color Refinement, Composition Refinement, Motion Reduction, Plan Refinement, Refine the Design, Simplification, Verify Quality (+2 more)

### Community 148 - "Init flow"
Cohesion: 0.20
Nodes (10): Completion gate, Init flow, Step 1: Load current state, Step 2: Explore the project, Step 3: Interview for product truth, Step 4: Write PRODUCT.md, Step 5: Configure live mode when useful, Step 6: Wrap up or resume (+2 more)

### Community 149 - "The list"
Cohesion: 0.20
Nodes (9): Charts, Common mismatches to catch, How to use this, Interaction & performance, Motion & visuals, Picking The Right Library, State & styling, The list (+1 more)

### Community 150 - "Jarvis: AI-Powered Voice Assistant & Productivity Suite"
Cohesion: 0.20
Nodes (9): 🤝 Contributing, 🚀 Getting Started, 🧠 How the AI Works, Installation, Jarvis: AI-Powered Voice Assistant & Productivity Suite, 🌟 Key Features, 📝 License, Prerequisites (+1 more)

### Community 151 - "Design Engineering"
Cohesion: 0.22
Nodes (8): Accessibility, Design Engineering, Initial Response, prefers-reduced-motion, Review Checklist, Review Format (Required), Stagger Animations, Touch device hover states

### Community 152 - "Common Cognitive Load Violations"
Cohesion: 0.22
Nodes (9): 1. The Wall of Options, 2. The Memory Bridge, 3. The Hidden Navigation, 4. The Jargon Barrier, 5. The Visual Noise Floor, 6. The Inconsistent Pattern, 7. The Multi-Task Demand, 8. The Context Switch (+1 more)

### Community 153 - "Operate mode depth (and Read notes)"
Cohesion: 0.22
Nodes (9): Color, Components, Layout, Motion, Operate mode depth (and Read notes), Product constraints, Product permissions, The product slop test (+1 more)

### Community 154 - "Shape"
Cohesion: 0.22
Nodes (8): Cadence, Confirm and stop, Phase 1: Discovery interview, Phase 2: Resolve the design direction, Phase 3: Write the brief, Round 1: purpose, people, and outcome, Round 2: material, behavior, and boundaries, Shape

### Community 155 - "client/vercel.json"
Cohesion: 0.40
Nodes (4): buildCommand, framework, outputDirectory, rewrites

### Community 156 - "Component Building Principles"
Cohesion: 0.25
Nodes (8): Animate enter states with @starting-style, Buttons must feel responsive, Component Building Principles, Make popovers origin-aware, Never animate from scale(0), Tooltips: skip delay on subsequent hovers, Use blur to mask imperfect transitions, Use CSS transitions over keyframes for interruptible UI

### Community 157 - "CSP detection (first-time only)"
Cohesion: 0.29
Nodes (7): append-arrays, append-string, Consent prompt template, CSP detection (first-time only), Drift-heal warning, First-time setup (config missing or invalid), Troubleshooting

### Community 158 - "Persona-Based Design Testing"
Cohesion: 0.25
Nodes (8): 1. Impatient Power User: "Alex", 2. Confused First-Timer: "Jordan", 3. Accessibility-Dependent User: "Sam", 4. Deliberate Stress Tester: "Riley", 5. Distracted Mobile User: "Casey", Persona-Based Design Testing, Project-Specific Personas, Selecting Personas

### Community 159 - "expandScanTargets"
Cohesion: 0.36
Nodes (8): coLocatedStylesheets(), expandScanTargets(), hasPathTraversal(), isInsideProject(), looksLikeProjectRoot(), normalizeScanTargets(), parseStaticStyleImports(), resolveCacheCwd()

### Community 160 - "Extract Flow"
Cohesion: 0.25
Nodes (7): Extract Flow, Step 1: Discover the Design System, Step 2: Identify Patterns, Step 3: Plan Extraction, Step 4: Extract & Enrich, Step 5: Migrate, Step 6: Document

### Community 162 - "OmniRoute Integration Skill"
Cohesion: 0.25
Nodes (7): Available Models, Configuration Details, Instructions, OmniRoute Integration Skill, Prerequisites, Verification, When to use

### Community 163 - "browser-script-parts.mjs"
Cohesion: 0.33
Nodes (6): assembleLiveBrowserScript(), assertLiveBrowserScriptParts(), LIVE_BROWSER_SCRIPT_PARTS, readLiveBrowserScriptParts(), resolveLiveBrowserScriptParts(), loadBrowserScripts()

### Community 165 - "Cognitive Load Assessment"
Cohesion: 0.29
Nodes (7): Cognitive Load Assessment, Cognitive Load Checklist, Extraneous Load: Bad Design, Germane Load: Learning Effort, Intrinsic Load: The Task Itself, The Working Memory Rule, Three Types of Cognitive Load

### Community 167 - "The Animation Decision Framework"
Cohesion: 0.33
Nodes (6): 1. Should this animate at all?, 2. What is the purpose?, 3. What easing should it use?, 4. How fast should it be?, Perceived performance, The Animation Decision Framework

### Community 168 - "clip-path for Animation"
Cohesion: 0.33
Nodes (6): clip-path for Animation, Comparison sliders, Hold-to-delete pattern, Image reveals on scroll, Tabs with perfect color transitions, The inset shape

### Community 169 - "Performance Rules"
Cohesion: 0.33
Nodes (6): CSS animations beat JS under load, CSS variables are inheritable, Framer Motion hardware acceleration caveat, Only animate transform and opacity, Performance Rules, Use WAAPI for programmatic CSS animations

### Community 170 - "Gesture and Drag Interactions"
Cohesion: 0.33
Nodes (6): Damping at boundaries, Friction instead of hard stops, Gesture and Drag Interactions, Momentum-based dismissal, Multi-touch protection, Pointer capture for drag

### Community 173 - "impeccable/SKILL.md"
Cohesion: 0.09
Nodes (19): Craft (deprecated alias), Craft floor, Refuse, Verify, Pitfalls, Seed mode, Step 1: Route through new-work's workshop, Step 2: Write seed DESIGN.md (+11 more)

### Community 175 - "CSS Transform Mastery"
Cohesion: 0.40
Nodes (5): 3D transforms for depth, CSS Transform Mastery, scale() scales children too, transform-origin, translateY with percentages

### Community 176 - "The Sonner Principles (Building Loved Components)"
Cohesion: 0.40
Nodes (5): Asymmetric enter/exit timing, Cohesion matters, Review your work the next day, The opacity + height combination, The Sonner Principles (Building Loved Components)

### Community 177 - "Spring Animations"
Cohesion: 0.40
Nodes (5): Interruptibility advantage, Spring Animations, Spring-based mouse interactions, Spring configuration, When to use springs

### Community 179 - "Core Philosophy"
Cohesion: 0.50
Nodes (4): Beauty is leverage, Core Philosophy, Taste is trained, not innate, Unseen details compound

### Community 180 - "Debugging Animations"
Cohesion: 0.50
Nodes (4): Debugging Animations, Frame-by-frame inspection, Slow motion testing, Test on real devices

### Community 181 - "Heuristics Scoring Guide"
Cohesion: 0.50
Nodes (4): Heuristics Scoring Guide, Issue Severity (P0–P3), Reference Material, Score Summary

### Community 182 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 183 - "cn"
Cohesion: 0.29
Nodes (10): NodeData, ProductivityConstellation3D(), ProductivityConstellation3DProps, Card, CardContent, CardDescription, CardFooter, CardHeader (+2 more)

### Community 184 - "detect-text.mjs"
Cohesion: 0.09
Nodes (30): blankCssComments(), CSS_IN_JS_EXTENSIONS, detectText(), extFromFilePath(), extractCSSinJS(), extractStyleBlocks(), firstOverusedGoogleFont(), hexChannels() (+22 more)

### Community 187 - "vercel.json"
Cohesion: 0.50
Nodes (3): buildCommand, outputDirectory, rewrites

## Knowledge Gaps
- **991 isolated node(s):** `here`, `API_BASE`, `API_TIMEOUT_MS`, `localStates`, `SEED_MODES` (+986 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `loadContext()` connect `loadContext` to `critique-storage.mjs`, `runHook`, `context.mjs`, `hook-lib.mjs`, `live-server.mjs`, `doctor.mjs`, `context-signals.mjs`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `createManualApplyController()` connect `manual-apply.mjs` to `live-server.mjs`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `here`, `API_BASE`, `API_TIMEOUT_MS` to the rest of the system?**
  _991 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `live-browser.js` be split into smaller, more focused modules?**
  _Cohesion score 0.03137112403100775 - nodes in this community are weakly interconnected._
- **Should `checks.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.03407972440944882 - nodes in this community are weakly interconnected._
- **Should `connectSSE` be split into smaller, more focused modules?**
  _Cohesion score 0.06234567901234568 - nodes in this community are weakly interconnected._
- **Should `index.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.06142410015649452 - nodes in this community are weakly interconnected._