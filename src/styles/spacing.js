// Spacing Scale (based on 4px grid system)
export const spacing = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 12,   // 12px
  lg: 16,   // 16px
  xl: 20,   // 20px
  '2xl': 24, // 24px
  '3xl': 32, // 32px
  '4xl': 40, // 40px
  '5xl': 48, // 48px
  '6xl': 64, // 64px
  '7xl': 80, // 80px
  '8xl': 96, // 96px
};

// Padding Utilities
export const padding = {
  // All sides
  xs: { padding: spacing.xs },
  sm: { padding: spacing.sm },
  md: { padding: spacing.md },
  lg: { padding: spacing.lg },
  xl: { padding: spacing.xl },
  '2xl': { padding: spacing['2xl'] },
  '3xl': { padding: spacing['3xl'] },
  '4xl': { padding: spacing['4xl'] },
  '5xl': { padding: spacing['5xl'] },

  // Horizontal
  horizontal: {
    xs: { paddingHorizontal: spacing.xs },
    sm: { paddingHorizontal: spacing.sm },
    md: { paddingHorizontal: spacing.md },
    lg: { paddingHorizontal: spacing.lg },
    xl: { paddingHorizontal: spacing.xl },
    '2xl': { paddingHorizontal: spacing['2xl'] },
    '3xl': { paddingHorizontal: spacing['3xl'] },
    '4xl': { paddingHorizontal: spacing['4xl'] },
  },

  // Vertical
  vertical: {
    xs: { paddingVertical: spacing.xs },
    sm: { paddingVertical: spacing.sm },
    md: { paddingVertical: spacing.md },
    lg: { paddingVertical: spacing.lg },
    xl: { paddingVertical: spacing.xl },
    '2xl': { paddingVertical: spacing['2xl'] },
    '3xl': { paddingVertical: spacing['3xl'] },
    '4xl': { paddingVertical: spacing['4xl'] },
  },

  // Individual sides
  top: {
    xs: { paddingTop: spacing.xs },
    sm: { paddingTop: spacing.sm },
    md: { paddingTop: spacing.md },
    lg: { paddingTop: spacing.lg },
    xl: { paddingTop: spacing.xl },
    '2xl': { paddingTop: spacing['2xl'] },
    '3xl': { paddingTop: spacing['3xl'] },
  },
  bottom: {
    xs: { paddingBottom: spacing.xs },
    sm: { paddingBottom: spacing.sm },
    md: { paddingBottom: spacing.md },
    lg: { paddingBottom: spacing.lg },
    xl: { paddingBottom: spacing.xl },
    '2xl': { paddingBottom: spacing['2xl'] },
    '3xl': { paddingBottom: spacing['3xl'] },
  },
  left: {
    xs: { paddingLeft: spacing.xs },
    sm: { paddingLeft: spacing.sm },
    md: { paddingLeft: spacing.md },
    lg: { paddingLeft: spacing.lg },
    xl: { paddingLeft: spacing.xl },
    '2xl': { paddingLeft: spacing['2xl'] },
    '3xl': { paddingLeft: spacing['3xl'] },
  },
  right: {
    xs: { paddingRight: spacing.xs },
    sm: { paddingRight: spacing.sm },
    md: { paddingRight: spacing.md },
    lg: { paddingRight: spacing.lg },
    xl: { paddingRight: spacing.xl },
    '2xl': { paddingRight: spacing['2xl'] },
    '3xl': { paddingRight: spacing['3xl'] },
  },
};

// Margin Utilities
export const margin = {
  // All sides
  xs: { margin: spacing.xs },
  sm: { margin: spacing.sm },
  md: { margin: spacing.md },
  lg: { margin: spacing.lg },
  xl: { margin: spacing.xl },
  '2xl': { margin: spacing['2xl'] },
  '3xl': { margin: spacing['3xl'] },
  '4xl': { margin: spacing['4xl'] },
  '5xl': { margin: spacing['5xl'] },

  // Horizontal
  horizontal: {
    xs: { marginHorizontal: spacing.xs },
    sm: { marginHorizontal: spacing.sm },
    md: { marginHorizontal: spacing.md },
    lg: { marginHorizontal: spacing.lg },
    xl: { marginHorizontal: spacing.xl },
    '2xl': { marginHorizontal: spacing['2xl'] },
    '3xl': { marginHorizontal: spacing['3xl'] },
    '4xl': { marginHorizontal: spacing['4xl'] },
  },

  // Vertical
  vertical: {
    xs: { marginVertical: spacing.xs },
    sm: { marginVertical: spacing.sm },
    md: { marginVertical: spacing.md },
    lg: { marginVertical: spacing.lg },
    xl: { marginVertical: spacing.xl },
    '2xl': { marginVertical: spacing['2xl'] },
    '3xl': { marginVertical: spacing['3xl'] },
    '4xl': { marginVertical: spacing['4xl'] },
  },

  // Individual sides
  top: {
    xs: { marginTop: spacing.xs },
    sm: { marginTop: spacing.sm },
    md: { marginTop: spacing.md },
    lg: { marginTop: spacing.lg },
    xl: { marginTop: spacing.xl },
    '2xl': { marginTop: spacing['2xl'] },
    '3xl': { marginTop: spacing['3xl'] },
  },
  bottom: {
    xs: { marginBottom: spacing.xs },
    sm: { marginBottom: spacing.sm },
    md: { marginBottom: spacing.md },
    lg: { marginBottom: spacing.lg },
    xl: { marginBottom: spacing.xl },
    '2xl': { marginBottom: spacing['2xl'] },
    '3xl': { marginBottom: spacing['3xl'] },
  },
  left: {
    xs: { marginLeft: spacing.xs },
    sm: { marginLeft: spacing.sm },
    md: { marginLeft: spacing.md },
    lg: { marginLeft: spacing.lg },
    xl: { marginLeft: spacing.xl },
    '2xl': { marginLeft: spacing['2xl'] },
    '3xl': { marginLeft: spacing['3xl'] },
  },
  right: {
    xs: { marginRight: spacing.xs },
    sm: { marginRight: spacing.sm },
    md: { marginRight: spacing.md },
    lg: { marginRight: spacing.lg },
    xl: { marginRight: spacing.xl },
    '2xl': { marginRight: spacing['2xl'] },
    '3xl': { marginRight: spacing['3xl'] },
  },
};

// Gap utilities (for flexbox)
export const gap = {
  xs: { gap: spacing.xs },
  sm: { gap: spacing.sm },
  md: { gap: spacing.md },
  lg: { gap: spacing.lg },
  xl: { gap: spacing.xl },
  '2xl': { gap: spacing['2xl'] },
  '3xl': { gap: spacing['3xl'] },
  '4xl': { gap: spacing['4xl'] },
};

// Border Radius
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

// Component Specific Spacing
export const componentSpacing = {
  // Screen padding
  screen: {
    horizontal: spacing.lg,
    vertical: spacing.xl,
  },
  
  // Card spacing
  card: {
    padding: spacing.lg,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
  },
  
  // Button spacing
  button: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  
  // Input spacing
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  
  // List item spacing
  listItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xs,
  },
  
  // Header spacing
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
};