# Pull Request Template

## Summary
<!-- What does this PR do and why? -->

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Infrastructure / DevOps
- [ ] Documentation

## Module(s) Affected
<!-- e.g., booking, pms, shared -->

## Multi-Tenancy Checklist
- [ ] All new database queries filter by `hotel_id`
- [ ] No cross-tenant data leakage possible
- [ ] Tenant context validated in guards/middleware

## Test Plan
- [ ] Unit tests added/updated
- [ ] Manual testing performed
- [ ] Responsive design verified (mobile/tablet/desktop)

## Screenshots (if UI change)
