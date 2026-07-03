-- CreateEnum
CREATE TYPE "OtpChannel" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('LOGIN', 'MFA', 'PASSWORD_RESET', 'EMAIL_VERIFICATION', 'PHONE_VERIFICATION');

-- CreateEnum
CREATE TYPE "SecurityEventType" AS ENUM ('FAILED_LOGIN', 'ACCOUNT_LOCKED', 'PASSWORD_CHANGED', 'NEW_DEVICE', 'SUSPICIOUS_IP', 'TOKEN_REVOKED', 'MFA_ENABLED', 'MFA_DISABLED');

-- CreateEnum
CREATE TYPE "RatePlanType" AS ENUM ('STANDARD', 'CORPORATE', 'MEMBER', 'WEEKEND', 'FESTIVAL', 'LONG_STAY', 'LAST_MINUTE', 'NON_REFUNDABLE', 'REFUNDABLE', 'PACKAGE');

-- CreateEnum
CREATE TYPE "CancellationPolicyType" AS ENUM ('FREE_CANCELLATION', 'PARTIAL_REFUND', 'NON_REFUNDABLE', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "BookingAddonCategory" AS ENUM ('MEAL', 'TRANSPORT', 'SPA', 'ROOM', 'CELEBRATION', 'OTHER');

-- CreateEnum
CREATE TYPE "InventoryHoldStatus" AS ENUM ('ACTIVE', 'CONVERTED', 'EXPIRED', 'RELEASED');

-- CreateEnum
CREATE TYPE "ChannelSyncJobType" AS ENUM ('INVENTORY', 'RATES', 'RESTRICTIONS', 'PROMOTIONS', 'FULL');

-- CreateEnum
CREATE TYPE "ChannelSyncJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRYING', 'DEAD_LETTER');

-- CreateEnum
CREATE TYPE "ChannelWebhookEventType" AS ENUM ('BOOKING_CREATED', 'BOOKING_MODIFIED', 'BOOKING_CANCELLED', 'PAYMENT_RECEIVED', 'SYNC_SUCCESS', 'SYNC_FAILED', 'INVENTORY_CONFLICT', 'RATE_CONFLICT');

-- CreateEnum
CREATE TYPE "ChannelEnvironment" AS ENUM ('SANDBOX', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "CmsContentStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CmsMediaType" AS ENUM ('IMAGE', 'VIDEO', 'PDF', 'DOCUMENT', 'AUDIO');

-- CreateEnum
CREATE TYPE "CmsFormType" AS ENUM ('CONTACT', 'CORPORATE_INQUIRY', 'RESTAURANT_BOOKING', 'EVENT_INQUIRY', 'GENERAL_INQUIRY', 'NEWSLETTER');

-- CreateEnum
CREATE TYPE "CorpContractStatus" AS ENUM ('DRAFT', 'LEGAL_REVIEW', 'PENDING_APPROVAL', 'APPROVED', 'ACTIVE', 'EXPIRED', 'TERMINATED', 'RENEWAL');

-- CreateEnum
CREATE TYPE "CorpSalesLeadStatus" AS ENUM ('NEW', 'QUALIFIED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'NEGOTIATION', 'LEGAL_REVIEW', 'CONTRACT_DRAFT', 'APPROVED', 'WON', 'LOST', 'RENEWAL');

-- CreateEnum
CREATE TYPE "CorpSalesLeadSource" AS ENUM ('WEBSITE', 'COLD_CALLING', 'LINKEDIN', 'REFERRAL', 'EMAIL_CAMPAIGN', 'TRADE_SHOW', 'CONFERENCE', 'WALK_IN', 'GOOGLE_ADS', 'PARTNER', 'OTHER');

-- CreateEnum
CREATE TYPE "CorpRatePlanType" AS ENUM ('STANDARD', 'LONG_STAY', 'PROJECT', 'CREW', 'GOVERNMENT', 'VOLUME', 'PREFERRED_PARTNER');

-- CreateEnum
CREATE TYPE "CorpRatePlanStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CorpSalesTaskType" AS ENUM ('CALL', 'VISIT', 'PROPOSAL', 'RENEWAL', 'PAYMENT', 'BIRTHDAY', 'ANNIVERSARY', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "CorpSalesTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CorpMeetingStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "CorpApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "CorpApprovalType" AS ENUM ('TRAVEL_DESK', 'DEPARTMENT_HEAD', 'FINANCE', 'COMPANY', 'HOTEL', 'RATE', 'CONTRACT');

-- CreateEnum
CREATE TYPE "CorpBillingInvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CorpDocumentType" AS ENUM ('CONTRACT', 'NDA', 'GST_CERTIFICATE', 'PAN', 'MSME', 'PURCHASE_ORDER', 'RATE_AGREEMENT', 'EMAIL', 'MEETING_NOTES', 'OTHER');

-- CreateEnum
CREATE TYPE "CorpRoomAllocationType" AS ENUM ('CORPORATE', 'LONG_STAY', 'VIP', 'CONFERENCE', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'BOOKED', 'REWARDED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GiftCardStatus" AS ENUM ('ACTIVE', 'REDEEMED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AutomationTrigger" AS ENUM ('BOOKING_CREATED', 'CHECK_IN', 'CHECK_OUT', 'BIRTHDAY', 'ANNIVERSARY', 'FESTIVAL', 'LOYALTY_UPGRADE', 'FEEDBACK_RECEIVED', 'INACTIVE_GUEST');

-- CreateEnum
CREATE TYPE "WorkOrderStatus" AS ENUM ('NEW', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'WAITING_FOR_PARTS', 'WAITING_VENDOR', 'PAUSED', 'COMPLETED', 'INSPECTED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AssetLifecycleStage" AS ENUM ('PURCHASED', 'INSTALLED', 'OPERATIONAL', 'INSPECTION', 'REPAIR', 'AMC', 'WARRANTY', 'UPGRADE', 'REPLACEMENT', 'DISPOSED');

-- CreateEnum
CREATE TYPE "PmFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'METER_BASED');

-- CreateEnum
CREATE TYPE "MaintenanceRequestSource" AS ENUM ('FRONT_DESK', 'HOUSEKEEPING', 'RESTAURANT', 'GUEST_PORTAL', 'MAINTENANCE_TEAM', 'MANAGER', 'IOT_DEVICE');

-- CreateEnum
CREATE TYPE "CorrectiveType" AS ENUM ('BREAKDOWN', 'FAULT', 'DAMAGE', 'LEAKAGE', 'ELECTRICAL', 'MECHANICAL', 'SOFTWARE', 'NETWORK');

-- CreateEnum
CREATE TYPE "DepreciationMethod" AS ENUM ('STRAIGHT_LINE', 'DECLINING_BALANCE', 'UNITS_OF_PRODUCTION');

-- CreateEnum
CREATE TYPE "EamInspectionType" AS ENUM ('ELECTRICAL', 'MECHANICAL', 'CLEANING', 'SAFETY', 'PERFORMANCE');

-- CreateEnum
CREATE TYPE "SafetyEquipmentType" AS ENUM ('FIRE_EXTINGUISHER', 'SMOKE_DETECTOR', 'EMERGENCY_LIGHT', 'EMERGENCY_EXIT', 'FIRST_AID_KIT');

-- CreateEnum
CREATE TYPE "EnergyUtilityType" AS ENUM ('ELECTRICITY', 'WATER', 'GAS', 'DIESEL', 'GENERATOR', 'SOLAR');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('TRIAL', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "HotelStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING_SETUP', 'CHURNED');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'GUARANTEED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW', 'ON_HOLD', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "BookingSource" AS ENUM ('DIRECT_WEBSITE', 'WALK_IN', 'PHONE', 'EMAIL', 'OTA_BOOKING_COM', 'OTA_EXPEDIA', 'OTA_AGODA', 'OTA_MMT', 'CORPORATE_PORTAL', 'TRAVEL_AGENT', 'GDS', 'CHANNEL_MANAGER', 'OTHER');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('VACANT_CLEAN', 'VACANT_DIRTY', 'VACANT', 'OCCUPIED', 'RESERVED', 'DIRTY', 'CLEANING', 'INSPECTED', 'OUT_OF_ORDER', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "RoomCategory" AS ENUM ('STANDARD', 'DELUXE', 'SUITE', 'VILLA', 'COTTAGE', 'PRESIDENTIAL');

-- CreateEnum
CREATE TYPE "RoomBlockReason" AS ENUM ('MAINTENANCE', 'VIP_RESERVATION', 'DEEP_CLEANING', 'GOVERNMENT_BOOKING', 'PRIVATE_EVENT', 'MANUAL');

-- CreateEnum
CREATE TYPE "GroupBookingType" AS ENUM ('WEDDING', 'CORPORATE', 'CONFERENCE', 'SPORTS_TEAM', 'TOUR_GROUP', 'SCHOOL_GROUP', 'OTHER');

-- CreateEnum
CREATE TYPE "FolioChargeCategory" AS ENUM ('ROOM', 'RESTAURANT', 'LAUNDRY', 'MINI_BAR', 'SPA', 'TRANSPORT', 'TAX', 'DISCOUNT', 'LOYALTY', 'OTHER');

-- CreateEnum
CREATE TYPE "CheckInStep" AS ENUM ('RESERVATION', 'GUEST_VERIFICATION', 'DOCUMENT_UPLOAD', 'DIGITAL_SIGNATURE', 'PAYMENT_VERIFICATION', 'ROOM_ASSIGNMENT', 'KEY_CARD_ISSUE', 'COMPLETE');

-- CreateEnum
CREATE TYPE "NightAuditStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "KeyCardStatus" AS ENUM ('ACTIVE', 'DEACTIVATED', 'LOST', 'REISSUED');

-- CreateEnum
CREATE TYPE "GuestRequestType" AS ENUM ('EXTRA_BED', 'BABY_CRIB', 'EXTRA_PILLOW', 'AIRPORT_PICKUP', 'AIRPORT_DROP', 'BIRTHDAY_DECORATION', 'ANNIVERSARY_DECORATION', 'WHEELCHAIR', 'LATE_ARRIVAL', 'EARLY_CHECKIN', 'LATE_CHECKOUT', 'OTHER');

-- CreateEnum
CREATE TYPE "GuestRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "FrontDeskTaskType" AS ENUM ('WAKE_UP_CALL', 'TAXI', 'AIRPORT_PICKUP', 'GUEST_REQUEST', 'LAUNDRY', 'HOUSEKEEPING', 'MAINTENANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "FrontDeskTaskStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LostFoundStatus" AS ENUM ('FOUND', 'CLAIMED', 'DISPOSED', 'TRANSFERRED');

-- CreateEnum
CREATE TYPE "GuestCommunicationChannel" AS ENUM ('WHATSAPP', 'EMAIL', 'SMS', 'IN_APP');

-- CreateEnum
CREATE TYPE "GuestCommunicationType" AS ENUM ('BOOKING_CONFIRMATION', 'WELCOME', 'ROOM_READY', 'CHECKOUT_REMINDER', 'INVOICE', 'FEEDBACK_REQUEST', 'CUSTOM');

-- CreateEnum
CREATE TYPE "FrontDeskLogAction" AS ENUM ('CHECK_IN', 'CHECK_OUT', 'ROOM_ASSIGN', 'ROOM_TRANSFER', 'PAYMENT', 'KEY_ISSUE', 'COMPLAINT', 'WALK_IN', 'COMMUNICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "HousekeepingStatus" AS ENUM ('PENDING', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'INSPECTED', 'APPROVED', 'REJECTED', 'REOPENED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED', 'PROBATION');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'CAPTURED', 'PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED', 'VOIDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'BANK_TRANSFER', 'WALLET', 'RAZORPAY', 'STRIPE', 'CHEQUE', 'CORPORATE_CREDIT', 'LOYALTY_POINTS', 'OTHER');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'VOID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('GST', 'VAT', 'SERVICE_TAX', 'CITY_TAX', 'TOURISM_TAX', 'CGST', 'SGST', 'IGST', 'CESS', 'OTHER');

-- CreateEnum
CREATE TYPE "MaintenancePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'IN_APP', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'BOUNCED');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'CLOSED', 'REOPENED');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_NIGHT', 'FREE_SERVICE', 'BUNDLE');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'COMPLIMENTARY', 'CORPORATE_RATE', 'PROMOTIONAL');

-- CreateEnum
CREATE TYPE "LoyaltyType" AS ENUM ('EARN', 'REDEEM', 'EXPIRE', 'ADJUSTMENT', 'TRANSFER', 'BONUS');

-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'CORPORATE');

-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'NIGHT', 'SPLIT', 'FLEXIBLE', 'ON_CALL');

-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('SUPER_ADMIN', 'HOTEL_OWNER', 'GENERAL_MANAGER', 'RECEPTIONIST', 'RESERVATION_TEAM', 'HOUSEKEEPING', 'RESTAURANT_MANAGER', 'KITCHEN_STAFF', 'STORE_MANAGER', 'INVENTORY_MANAGER', 'FINANCE', 'HR', 'MARKETING', 'CORPORATE_CLIENT', 'GUEST', 'VENDOR');

-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('OPEN', 'CLOSED', 'VOID', 'MERGED');

-- CreateEnum
CREATE TYPE "KitchenOrderStatus" AS ENUM ('PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'SUBMITTED', 'APPROVED', 'SENT', 'PARTIALLY_RECEIVED', 'FULLY_RECEIVED', 'RECEIVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('RECEIPT', 'ISSUE', 'TRANSFER', 'ADJUSTMENT', 'RETURN', 'WASTE', 'CONSUMPTION');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "JournalEntryStatus" AS ENUM ('DRAFT', 'POSTED', 'REVERSED');

-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('DRAFT', 'CALCULATED', 'APPROVED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'ON_LEAVE', 'HOLIDAY', 'WEEK_OFF');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('INQUIRY', 'TENTATIVE', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'ON_TRIP', 'IN_USE', 'MAINTENANCE', 'CLEANING', 'BREAKDOWN', 'OUT_OF_SERVICE', 'RETIRED');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('REQUESTED', 'APPROVED', 'VEHICLE_ASSIGNED', 'DRIVER_ASSIGNED', 'DRIVER_EN_ROUTE', 'GUEST_PICKED', 'TRIP_STARTED', 'TRIP_COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TripPaymentStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'BILLED_TO_ROOM', 'CORPORATE_CREDIT', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ParkingStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "FileCategory" AS ENUM ('GUEST_PHOTO', 'GUEST_ID', 'EMPLOYEE_DOCUMENT', 'INVOICE', 'RECEIPT', 'ROOM_IMAGE', 'HOTEL_LOGO', 'MENU_IMAGE', 'CONTRACT', 'ATTACHMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "AttachmentEntityType" AS ENUM ('GUEST', 'STAFF', 'RESERVATION', 'ROOM', 'BILL', 'INVOICE', 'PURCHASE_ORDER', 'MAINTENANCE', 'COMPLAINT', 'EVENT', 'CORPORATE_CONTRACT', 'OTHER');

-- CreateEnum
CREATE TYPE "OtaIntegrationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ERROR', 'SYNCING');

-- CreateEnum
CREATE TYPE "AiPredictionType" AS ENUM ('OCCUPANCY', 'REVENUE', 'DEMAND', 'CHURN', 'STAFFING', 'INVENTORY', 'PRICING');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'RESTORE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'APPROVE', 'REJECT');

-- CreateEnum
CREATE TYPE "SettingScope" AS ENUM ('PLATFORM', 'HOTEL', 'MODULE', 'USER');

-- CreateEnum
CREATE TYPE "FeatureFlagScope" AS ENUM ('PLATFORM', 'HOTEL', 'PLAN');

-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('ROOM_REVENUE', 'FNB_REVENUE', 'EVENT_REVENUE', 'OTHER_REVENUE', 'SERVICE_CHARGE', 'MISCELLANEOUS');

-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID');

-- CreateEnum
CREATE TYPE "TravelRequestStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AirportPickupStatus" AS ENUM ('SCHEDULED', 'DRIVER_ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "CrmLeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "MarketingCampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ChannelSyncStatus" AS ENUM ('SYNCED', 'PENDING', 'FAILED', 'DISABLED');

-- CreateEnum
CREATE TYPE "LaundryStatus" AS ENUM ('COLLECTED', 'IN_PROCESS', 'READY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('ACTIVE', 'IN_MAINTENANCE', 'DISPOSED', 'LOST');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('GENERAL', 'STAY', 'DINING', 'SERVICE', 'FACILITY', 'STAFF');

-- CreateEnum
CREATE TYPE "ReviewSource" AS ENUM ('DIRECT', 'GOOGLE', 'TRIPADVISOR', 'BOOKING_COM', 'INTERNAL', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplaintPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "SalaryComponentType" AS ENUM ('EARNING', 'DEDUCTION', 'EMPLOYER_CONTRIBUTION');

-- CreateEnum
CREATE TYPE "LoginStatus" AS ENUM ('SUCCESS', 'FAILED', 'LOCKED', 'MFA_REQUIRED');

-- CreateEnum
CREATE TYPE "ApiLogDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "ErrorSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "EventLeadStatus" AS ENUM ('NEW', 'ASSIGNED', 'VENUE_VISIT', 'PROPOSAL', 'QUOTATION', 'NEGOTIATION', 'CONFIRMED', 'ADVANCE_PAID', 'PLANNING', 'OPERATIONS', 'EXECUTION', 'BILLING', 'COMPLETED', 'LOST');

-- CreateEnum
CREATE TYPE "EventLeadSource" AS ENUM ('WEBSITE', 'PHONE', 'WALK_IN', 'EMAIL', 'WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'GOOGLE_ADS', 'REFERRAL', 'TRAVEL_AGENT', 'CORPORATE_SALES', 'STORE', 'OTHER');

-- CreateEnum
CREATE TYPE "EventQuotationStatus" AS ENUM ('DRAFT', 'SENT', 'REVISION', 'APPROVED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "EventTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "EventTaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "EventPaymentType" AS ENUM ('BOOKING_ADVANCE', 'STAGE_PAYMENT', 'SECURITY_DEPOSIT', 'FINAL_SETTLEMENT', 'REFUND');

-- CreateEnum
CREATE TYPE "HallCalendarBlockType" AS ENUM ('BOOKING', 'BLOCKED', 'MAINTENANCE', 'TENTATIVE');

-- CreateEnum
CREATE TYPE "EventVendorCategory" AS ENUM ('DECORATOR', 'PHOTOGRAPHER', 'DJ', 'BAND', 'FLORIST', 'SOUND', 'LIGHTING', 'SECURITY', 'TRANSPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "AccountSubType" AS ENUM ('CURRENT_ASSET', 'FIXED_ASSET', 'CURRENT_LIABILITY', 'LONG_TERM_LIABILITY', 'EQUITY', 'OPERATING_REVENUE', 'OTHER_INCOME', 'OPERATING_EXPENSE', 'COST_OF_GOODS', 'DEPRECIATION', 'TAX');

-- CreateEnum
CREATE TYPE "FinVoucherType" AS ENUM ('JOURNAL', 'PAYMENT', 'RECEIPT', 'EXPENSE', 'CREDIT_NOTE', 'DEBIT_NOTE', 'CONTRA', 'OPENING', 'CLOSING');

-- CreateEnum
CREATE TYPE "FinApprovalStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'POSTED');

-- CreateEnum
CREATE TYPE "FinReceivableType" AS ENUM ('GUEST', 'CORPORATE', 'TRAVEL_AGENT', 'OTA', 'OTHER');

-- CreateEnum
CREATE TYPE "FinPayableType" AS ENUM ('VENDOR', 'UTILITY', 'SALARY', 'TAX', 'OTHER');

-- CreateEnum
CREATE TYPE "FinBankAccountType" AS ENUM ('CURRENT', 'SAVINGS', 'CASH', 'PETTY_CASH', 'UPI_WALLET');

-- CreateEnum
CREATE TYPE "FinCashTransactionType" AS ENUM ('COLLECTION', 'DEPOSIT', 'WITHDRAWAL', 'PETTY_CASH', 'RECONCILIATION');

-- CreateEnum
CREATE TYPE "FinGstType" AS ENUM ('CGST', 'SGST', 'IGST', 'CESS', 'REVERSE_CHARGE');

-- CreateEnum
CREATE TYPE "GxpRequestCategory" AS ENUM ('ROOM_SERVICE', 'HOUSEKEEPING', 'LAUNDRY', 'MAINTENANCE', 'SPA', 'TRANSPORT', 'WAKE_UP', 'CONCIERGE', 'OTHER');

-- CreateEnum
CREATE TYPE "GxpRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GxpChatDepartment" AS ENUM ('RECEPTION', 'RESTAURANT', 'HOUSEKEEPING', 'MAINTENANCE', 'MANAGER');

-- CreateEnum
CREATE TYPE "LinenStatus" AS ENUM ('AVAILABLE', 'IN_LAUNDRY', 'DAMAGED', 'LOST', 'DISPOSED');

-- CreateEnum
CREATE TYPE "JobOpeningStatus" AS ENUM ('DRAFT', 'OPEN', 'ON_HOLD', 'CLOSED', 'FILLED');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "OnboardingTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "TrainingEnrollmentStatus" AS ENUM ('ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PerformanceReviewStatus" AS ENUM ('DRAFT', 'SELF_REVIEW', 'MANAGER_REVIEW', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ExitProcessStatus" AS ENUM ('RESIGNATION_SUBMITTED', 'NOTICE_PERIOD', 'CLEARANCE', 'SETTLEMENT', 'COMPLETED');

-- CreateEnum
CREATE TYPE "HrExpenseClaimStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PAID');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('PERMANENT', 'PROBATION', 'CONTRACT', 'INTERN', 'TEMPORARY', 'CONSULTANT', 'DAILY_WAGE', 'PART_TIME');

-- CreateEnum
CREATE TYPE "InventoryStoreType" AS ENUM ('MAIN', 'KITCHEN', 'RESTAURANT', 'BAR', 'HOUSEKEEPING', 'LAUNDRY', 'MAINTENANCE', 'ENGINEERING', 'SPA', 'BANQUET', 'OFFICE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "InventoryItemStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "InventoryDepartment" AS ENUM ('RESTAURANT', 'KITCHEN', 'HOUSEKEEPING', 'LAUNDRY', 'MAINTENANCE', 'SPA', 'RECEPTION', 'BANQUET', 'BAR', 'OFFICE', 'STORES');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'IN_TRANSIT', 'RECEIVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ISSUED', 'RECEIVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AdjustmentType" AS ENUM ('DAMAGE', 'LOST', 'THEFT', 'BREAKAGE', 'MANUAL', 'CORRECTION', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AdjustmentStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PurchaseRequestStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'DEPT_APPROVED', 'STORE_APPROVED', 'PURCHASE_APPROVED', 'REJECTED', 'FULFILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CostMethod" AS ENUM ('AVERAGE', 'WEIGHTED', 'FIFO', 'LIFO', 'FEFO');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('ACTIVE', 'NEAR_EXPIRY', 'EXPIRED', 'BLOCKED', 'DEPLETED');

-- CreateEnum
CREATE TYPE "PaymentTerms" AS ENUM ('ADVANCE', 'NET_15', 'NET_30', 'NET_45', 'NET_60', 'CREDIT', 'PARTIAL');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED', 'BLACKLISTED');

-- CreateEnum
CREATE TYPE "GrnStatus" AS ENUM ('DRAFT', 'RECEIVED', 'INSPECTING', 'ACCEPTED', 'PARTIALLY_ACCEPTED', 'REJECTED', 'POSTED');

-- CreateEnum
CREATE TYPE "InspectionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProcPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ProcPrStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'DEPT_APPROVED', 'PM_APPROVED', 'APPROVED', 'REJECTED', 'CONVERTED_RFQ', 'CONVERTED_PO', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RfqStatus" AS ENUM ('DRAFT', 'SENT', 'QUOTATIONS_RECEIVED', 'COMPARING', 'VENDOR_SELECTED', 'CLOSED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SELECTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReturnReason" AS ENUM ('DAMAGED', 'EXPIRED', 'WRONG_QUANTITY', 'WRONG_PRODUCT', 'QUALITY_ISSUE');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'DISPATCHED', 'RECEIVED_BY_VENDOR', 'CLOSED');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRING', 'EXPIRED', 'RENEWED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "VendorInvoiceStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PENDING_MATCH', 'MATCHED', 'MISMATCH', 'APPROVED', 'REJECTED', 'PAID');

-- CreateEnum
CREATE TYPE "ApprovalLevel" AS ENUM ('EMPLOYEE', 'DEPT_HEAD', 'PURCHASE_MANAGER', 'FINANCE', 'GENERAL_MANAGER', 'OWNER');

-- CreateEnum
CREATE TYPE "FnbOrderType" AS ENUM ('DINE_IN', 'ROOM_SERVICE', 'TAKEAWAY', 'DELIVERY', 'CORPORATE', 'BANQUET', 'POOLSIDE');

-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'MERGED');

-- CreateEnum
CREATE TYPE "MenuItemType" AS ENUM ('FOOD', 'BEVERAGE', 'DESSERT', 'ALCOHOL', 'COMBO');

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "identifier" VARCHAR(255) NOT NULL,
    "code_hash" VARCHAR(255) NOT NULL,
    "channel" "OtpChannel" NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 5,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "verified_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "hotel_id" UUID,
    "refresh_token_id" UUID,
    "device_name" VARCHAR(100),
    "browser" VARCHAR(100),
    "os" VARCHAR(100),
    "ip_address" VARCHAR(45),
    "location" VARCHAR(255),
    "is_trusted" BOOLEAN NOT NULL DEFAULT false,
    "remember_me" BOOLEAN NOT NULL DEFAULT false,
    "last_active_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trusted_devices" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "device_name" VARCHAR(100) NOT NULL,
    "browser" VARCHAR(100),
    "os" VARCHAR(100),
    "fingerprint" VARCHAR(255) NOT NULL,
    "last_used_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "trusted_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" UUID NOT NULL,
    "hotel_id" UUID,
    "user_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "key_prefix" VARCHAR(20) NOT NULL,
    "key_hash" VARCHAR(255) NOT NULL,
    "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "expires_at" TIMESTAMPTZ,
    "last_used_at" TIMESTAMPTZ,
    "revoked_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "hotel_id" UUID,
    "event_type" "SecurityEventType" NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_history" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_blacklist" (
    "id" UUID NOT NULL,
    "jti" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_blacklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_plans" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_type_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "plan_type" "RatePlanType" NOT NULL,
    "base_rate" DECIMAL(12,2) NOT NULL,
    "cancellation_policy" "CancellationPolicyType" NOT NULL DEFAULT 'FREE_CANCELLATION',
    "free_cancel_until_hours" INTEGER,
    "breakfast_included" BOOLEAN NOT NULL DEFAULT false,
    "min_stay_nights" INTEGER NOT NULL DEFAULT 1,
    "max_stay_nights" INTEGER,
    "corporate_only" BOOLEAN NOT NULL DEFAULT false,
    "member_only" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "rate_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_addons" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "category" "BookingAddonCategory" NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "per_night" BOOLEAN NOT NULL DEFAULT false,
    "per_person" BOOLEAN NOT NULL DEFAULT false,
    "image_url" VARCHAR(1000),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "booking_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_addon_selections" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "addon_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "total_price" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_addon_selections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_holds" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "session_id" VARCHAR(100) NOT NULL,
    "room_type_id" UUID NOT NULL,
    "room_count" INTEGER NOT NULL DEFAULT 1,
    "check_in_date" DATE NOT NULL,
    "check_out_date" DATE NOT NULL,
    "status" "InventoryHoldStatus" NOT NULL DEFAULT 'ACTIVE',
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_holds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_events" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID,
    "session_id" VARCHAR(100),
    "event_type" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_rate_plan_mappings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "integration_id" UUID NOT NULL,
    "rate_plan_id" UUID NOT NULL,
    "external_rate_code" VARCHAR(100) NOT NULL,
    "external_rate_name" VARCHAR(200),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "channel_rate_plan_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_restrictions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "integration_id" UUID,
    "room_type_id" UUID,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "min_stay" INTEGER,
    "max_stay" INTEGER,
    "close_to_arrival" BOOLEAN NOT NULL DEFAULT false,
    "close_to_departure" BOOLEAN NOT NULL DEFAULT false,
    "stop_sell" BOOLEAN NOT NULL DEFAULT false,
    "booking_window_days" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "channel_restrictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_sync_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "integration_id" UUID NOT NULL,
    "job_id" UUID,
    "sync_type" "ChannelSyncJobType" NOT NULL,
    "status" "ChannelSyncStatus" NOT NULL DEFAULT 'PENDING',
    "message" VARCHAR(500),
    "payload" JSONB,
    "response" JSONB,
    "error_message" TEXT,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_webhook_events" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "integration_id" UUID,
    "event_type" "ChannelWebhookEventType" NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "external_ref" VARCHAR(200),
    "reservation_id" UUID,
    "payload" JSONB NOT NULL,
    "signature_valid" BOOLEAN NOT NULL DEFAULT true,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processed_at" TIMESTAMPTZ,
    "error_message" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_commission_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "integration_id" UUID NOT NULL,
    "reservation_id" UUID,
    "commission_pct" DECIMAL(8,4) NOT NULL,
    "booking_amount" DECIMAL(12,2) NOT NULL,
    "commission_amount" DECIMAL(12,2) NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_at" TIMESTAMPTZ,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_commission_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_sync_jobs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "integration_id" UUID,
    "job_type" "ChannelSyncJobType" NOT NULL,
    "status" "ChannelSyncJobStatus" NOT NULL DEFAULT 'PENDING',
    "priority" INTEGER NOT NULL DEFAULT 5,
    "payload" JSONB,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 5,
    "last_error" TEXT,
    "scheduled_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "bull_job_id" VARCHAR(100),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "channel_sync_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_pages" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "page_type" VARCHAR(100) NOT NULL,
    "status" "CmsContentStatus" NOT NULL DEFAULT 'DRAFT',
    "content" JSONB NOT NULL DEFAULT '{}',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "published_at" TIMESTAMPTZ,
    "scheduled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cms_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_sections" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "page_id" UUID,
    "section_key" VARCHAR(100) NOT NULL,
    "title" VARCHAR(500),
    "content" JSONB NOT NULL DEFAULT '{}',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "status" "CmsContentStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cms_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_hero_slides" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "subtitle" VARCHAR(1000),
    "desktop_image_url" VARCHAR(1000),
    "tablet_image_url" VARCHAR(1000),
    "mobile_image_url" VARCHAR(1000),
    "video_url" VARCHAR(1000),
    "overlay_color" VARCHAR(20),
    "overlay_opacity" DOUBLE PRECISION,
    "button_text" VARCHAR(200),
    "button_link" VARCHAR(500),
    "animation" VARCHAR(100),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "CmsContentStatus" NOT NULL DEFAULT 'DRAFT',
    "start_date" TIMESTAMPTZ,
    "end_date" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cms_hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_website_rooms" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_type_id" UUID,
    "name" VARCHAR(300) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "short_description" VARCHAR(500),
    "images" JSONB NOT NULL DEFAULT '[]',
    "images_360" JSONB NOT NULL DEFAULT '[]',
    "amenities" JSONB NOT NULL DEFAULT '[]',
    "max_guests" INTEGER,
    "price" DECIMAL(12,2),
    "weekend_price" DECIMAL(12,2),
    "peak_price" DECIMAL(12,2),
    "room_size" VARCHAR(50),
    "bed_type" VARCHAR(100),
    "floor" VARCHAR(50),
    "virtual_tour_url" VARCHAR(1000),
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "CmsContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cms_website_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_offers" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "offer_type" VARCHAR(100) NOT NULL,
    "discount" DECIMAL(8,2),
    "coupon_code" VARCHAR(50),
    "image_url" VARCHAR(1000),
    "price_label" VARCHAR(100),
    "start_date" TIMESTAMPTZ,
    "end_date" TIMESTAMPTZ,
    "status" "CmsContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cms_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_gallery_items" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "album_id" UUID,
    "title" VARCHAR(500),
    "media_type" "CmsMediaType" NOT NULL DEFAULT 'IMAGE',
    "url" VARCHAR(1000) NOT NULL,
    "thumbnail_url" VARCHAR(1000),
    "alt_text" VARCHAR(500),
    "category" VARCHAR(100),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "CmsContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "cms_gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_testimonials" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_name" VARCHAR(200) NOT NULL,
    "photo_url" VARCHAR(1000),
    "review" TEXT NOT NULL,
    "country" VARCHAR(100),
    "rating" SMALLINT NOT NULL DEFAULT 5,
    "stay_date" DATE,
    "room_name" VARCHAR(200),
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "CmsContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "cms_testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_media_folders" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "parent_id" UUID,
    "name" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cms_media_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_media_albums" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cms_media_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_media_files" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "folder_id" UUID,
    "file_name" VARCHAR(500) NOT NULL,
    "original_name" VARCHAR(500) NOT NULL,
    "media_type" "CmsMediaType" NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "url" VARCHAR(1000) NOT NULL,
    "thumbnail_url" VARCHAR(1000),
    "size_bytes" BIGINT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "alt_text" VARCHAR(500),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "uploaded_by" UUID,

    CONSTRAINT "cms_media_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_seo" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "page_id" UUID,
    "room_id" UUID,
    "offer_id" UUID,
    "meta_title" VARCHAR(200),
    "meta_description" VARCHAR(500),
    "meta_keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "og_title" VARCHAR(200),
    "og_description" VARCHAR(500),
    "og_image" VARCHAR(1000),
    "twitter_card" VARCHAR(50),
    "canonical_url" VARCHAR(1000),
    "schema_json" JSONB,
    "robots" VARCHAR(100),
    "slug" VARCHAR(200),
    "redirect_url" VARCHAR(1000),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cms_seo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_menus" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "menu_key" VARCHAR(100) NOT NULL,
    "label" VARCHAR(200) NOT NULL,
    "items" JSONB NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cms_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_forms" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "form_type" "CmsFormType" NOT NULL,
    "fields" JSONB NOT NULL DEFAULT '[]',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cms_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_form_submissions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "form_id" UUID NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cms_form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_newsletter_subscribers" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(200),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "source" VARCHAR(100),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cms_newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_blog_posts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "excerpt" VARCHAR(1000),
    "content" TEXT NOT NULL,
    "featured_image" VARCHAR(1000),
    "author_id" UUID,
    "category_id" UUID,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "CmsContentStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMPTZ,
    "scheduled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cms_blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_blog_categories" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cms_blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_revisions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "page_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "content" JSONB NOT NULL DEFAULT '{}',
    "status" "CmsContentStatus" NOT NULL,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cms_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_website_settings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "footer" JSONB NOT NULL DEFAULT '{}',
    "contact" JSONB NOT NULL DEFAULT '{}',
    "social" JSONB NOT NULL DEFAULT '{}',
    "branding" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cms_website_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_sales_leads" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "lead_code" VARCHAR(30) NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "industry" VARCHAR(100),
    "contact_name" VARCHAR(200),
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "source" "CorpSalesLeadSource" NOT NULL DEFAULT 'WEBSITE',
    "status" "CorpSalesLeadStatus" NOT NULL DEFAULT 'NEW',
    "lead_score" INTEGER NOT NULL DEFAULT 0,
    "expected_revenue" DECIMAL(14,2),
    "expected_room_nights" INTEGER,
    "decision_maker" VARCHAR(200),
    "probability" INTEGER NOT NULL DEFAULT 20,
    "assigned_to" UUID,
    "company_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,

    CONSTRAINT "corp_sales_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_company_contacts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "contact_type" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "designation" VARCHAR(100),
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "whatsapp" VARCHAR(30),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corp_company_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_account_teams" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "staff_name" VARCHAR(200) NOT NULL,
    "staff_id" UUID,
    "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corp_account_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_sales_meetings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "meeting_date" TIMESTAMPTZ NOT NULL,
    "participants" JSONB,
    "agenda" TEXT,
    "minutes" TEXT,
    "action_items" JSONB,
    "follow_up_date" DATE,
    "status" "CorpMeetingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corp_sales_meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_sales_activities" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "activity_type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "next_action" VARCHAR(255),
    "occurred_at" TIMESTAMPTZ NOT NULL,
    "created_by" UUID,

    CONSTRAINT "corp_sales_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_rate_plans" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "contract_id" UUID,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "rate_type" "CorpRatePlanType" NOT NULL,
    "status" "CorpRatePlanStatus" NOT NULL DEFAULT 'DRAFT',
    "base_rate" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "volume_tiers" JSONB,
    "valid_from" DATE,
    "valid_to" DATE,
    "approved_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "corp_rate_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_room_allocations" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "allocation_type" "CorpRoomAllocationType" NOT NULL,
    "room_type_id" UUID,
    "room_count" INTEGER NOT NULL DEFAULT 1,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "pms_synced" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corp_room_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_sales_tasks" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID,
    "task_type" "CorpSalesTaskType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "due_date" TIMESTAMPTZ,
    "status" "CorpSalesTaskStatus" NOT NULL DEFAULT 'PENDING',
    "assigned_to" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corp_sales_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_sales_documents" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "document_type" "CorpDocumentType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "file_url" VARCHAR(1000),
    "uploaded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corp_sales_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_credit_accounts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "credit_limit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "available_credit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "outstanding_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "overdue_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "corp_credit_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_billing_invoices" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "invoice_number" VARCHAR(30) NOT NULL,
    "billing_period" VARCHAR(20) NOT NULL,
    "invoice_type" VARCHAR(50) NOT NULL DEFAULT 'monthly',
    "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "paid_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "status" "CorpBillingInvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "due_date" DATE,
    "issued_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corp_billing_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_billing_payments" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "invoice_id" UUID,
    "amount" DECIMAL(14,2) NOT NULL,
    "reference" VARCHAR(100),
    "paid_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "corp_billing_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_contract_renewals" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "contract_id" UUID NOT NULL,
    "expiry_date" DATE NOT NULL,
    "notify_days" INTEGER NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'pending',
    "renewed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corp_contract_renewals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_sales_targets" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "period_type" VARCHAR(20) NOT NULL,
    "period_label" VARCHAR(30) NOT NULL,
    "revenue_target" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "room_night_target" INTEGER NOT NULL DEFAULT 0,
    "achieved_revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "achieved_room_nights" INTEGER NOT NULL DEFAULT 0,
    "assigned_to" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corp_sales_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_sales_commissions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID,
    "recipient_name" VARCHAR(200) NOT NULL,
    "commission_type" VARCHAR(50) NOT NULL,
    "base_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "commission_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "commission_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "status" VARCHAR(30) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "corp_sales_commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corp_approval_requests" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "approval_type" "CorpApprovalType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" "CorpApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "requested_by" UUID,
    "approved_by" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ,

    CONSTRAINT "corp_approval_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporate_companies" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "industry" VARCHAR(100),
    "gst_number" VARCHAR(50),
    "pan_number" VARCHAR(20),
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "address" TEXT,
    "website" VARCHAR(500),
    "head_office" VARCHAR(500),
    "branch_offices" JSONB,
    "billing_address" TEXT,
    "whatsapp" VARCHAR(30),
    "payment_terms" VARCHAR(100),
    "contract_status" VARCHAR(50),
    "category" VARCHAR(100),
    "account_manager_id" UUID,
    "credit_limit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "corporate_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporate_contracts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "contract_number" VARCHAR(50) NOT NULL,
    "rate_type" VARCHAR(50) NOT NULL DEFAULT 'negotiated',
    "discount_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "starts_at" DATE NOT NULL,
    "ends_at" DATE NOT NULL,
    "contract_url" VARCHAR(1000),
    "status" "CorpContractStatus" NOT NULL DEFAULT 'DRAFT',
    "seasonal_rates" JSONB,
    "weekend_rates" JSONB,
    "blackout_dates" JSONB,
    "cancellation_policy" TEXT,
    "credit_terms" VARCHAR(100),
    "payment_terms" VARCHAR(100),
    "sla" TEXT,
    "auto_renewal" BOOLEAN NOT NULL DEFAULT false,
    "signed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "corporate_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporate_employees" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "guest_id" UUID,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "department" VARCHAR(100),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "corporate_employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "corporate_bookings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "booking_code" VARCHAR(30) NOT NULL,
    "total_rooms" INTEGER NOT NULL DEFAULT 1,
    "check_in_date" DATE NOT NULL,
    "check_out_date" DATE NOT NULL,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "corporate_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "event_code" VARCHAR(30) NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'INQUIRY',
    "start_date" TIMESTAMPTZ NOT NULL,
    "end_date" TIMESTAMPTZ NOT NULL,
    "venue" VARCHAR(255),
    "expected_guests" INTEGER,
    "organizer_name" VARCHAR(255),
    "organizer_phone" VARCHAR(30),
    "notes" TEXT,
    "client_id" UUID,
    "hall_id" UUID,
    "assigned_to" UUID,
    "expected_revenue" DECIMAL(14,2),
    "confirmed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banquet_bookings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "hall_id" UUID,
    "hall_name" VARCHAR(100) NOT NULL,
    "package_name" VARCHAR(100),
    "guest_count" INTEGER NOT NULL DEFAULT 0,
    "rate" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "banquet_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_desk_requests" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID,
    "request_type" VARCHAR(50) NOT NULL,
    "status" "TravelRequestStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "from_location" VARCHAR(255),
    "to_location" VARCHAR(255),
    "scheduled_at" TIMESTAMPTZ,
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "travel_desk_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "vehicle_number" VARCHAR(30) NOT NULL,
    "registration_number" VARCHAR(30),
    "vehicle_type" VARCHAR(50) NOT NULL,
    "brand" VARCHAR(50),
    "model" VARCHAR(50),
    "year" INTEGER,
    "capacity" INTEGER NOT NULL DEFAULT 4,
    "fuel_type" VARCHAR(30),
    "transmission" VARCHAR(30),
    "color" VARCHAR(30),
    "owner" VARCHAR(100),
    "insurance_expiry" DATE,
    "fitness_expiry" DATE,
    "puc_expiry" DATE,
    "permit_expiry" DATE,
    "purchase_date" DATE,
    "current_odometer" INTEGER,
    "qr_code" VARCHAR(100),
    "gps_device_id" VARCHAR(100),
    "vendor_id" UUID,
    "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "driver_name" VARCHAR(100),
    "driver_phone" VARCHAR(30),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airport_pickups" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID,
    "travel_request_id" UUID,
    "vehicle_id" UUID,
    "guest_name" VARCHAR(255) NOT NULL,
    "guest_phone" VARCHAR(30),
    "flight_number" VARCHAR(20),
    "pickup_type" VARCHAR(20) NOT NULL DEFAULT 'arrival',
    "status" "AirportPickupStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduled_at" TIMESTAMPTZ NOT NULL,
    "completed_at" TIMESTAMPTZ,
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "airport_pickups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_slots" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "slot_number" VARCHAR(20) NOT NULL,
    "zone" VARCHAR(50),
    "status" "ParkingStatus" NOT NULL DEFAULT 'AVAILABLE',
    "vehicle_type" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "parking_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_records" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "slot_id" UUID NOT NULL,
    "vehicle_number" VARCHAR(30) NOT NULL,
    "guest_name" VARCHAR(255),
    "entry_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exit_at" TIMESTAMPTZ,
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "parking_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_timeline_events" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "occurred_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guest_timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_crm_notes" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "note" TEXT NOT NULL,
    "category" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "guest_crm_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "referrer_guest_id" UUID NOT NULL,
    "referred_email" VARCHAR(255) NOT NULL,
    "referred_name" VARCHAR(200),
    "referral_code" VARCHAR(30) NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "reward_points" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "booked_at" TIMESTAMPTZ,
    "rewarded_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_cards" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "guest_id" UUID,
    "initial_value" DECIMAL(12,2) NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,
    "status" "GiftCardStatus" NOT NULL DEFAULT 'ACTIVE',
    "is_digital" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "gift_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_automations" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "trigger" "AutomationTrigger" NOT NULL,
    "channel" VARCHAR(30) NOT NULL,
    "template" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "delay_hours" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "marketing_automations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "user_id" UUID,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT,
    "channel" VARCHAR(50),
    "metadata" JSONB,
    "sent_at" TIMESTAMPTZ,
    "read_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "recipient" VARCHAR(30) NOT NULL,
    "template_id" VARCHAR(100),
    "message" TEXT,
    "status" "NotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "provider_ref" VARCHAR(255),
    "error_message" TEXT,
    "sent_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "whatsapp_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "recipient" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(500) NOT NULL,
    "body" TEXT,
    "status" "NotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "provider_ref" VARCHAR(255),
    "error_message" TEXT,
    "sent_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "recipient" VARCHAR(30) NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "provider_ref" VARCHAR(255),
    "error_message" TEXT,
    "sent_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "sms_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID,
    "reservation_id" UUID,
    "type" "FeedbackType" NOT NULL DEFAULT 'GENERAL',
    "rating" SMALLINT,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID,
    "reservation_id" UUID,
    "source" "ReviewSource" NOT NULL DEFAULT 'INTERNAL',
    "rating" SMALLINT NOT NULL,
    "title" VARCHAR(255),
    "content" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "external_id" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "ComplaintPriority" NOT NULL DEFAULT 'MEDIUM',
    "category" VARCHAR(50),
    "resolved_at" TIMESTAMPTZ,
    "resolution" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_leads" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "company" VARCHAR(255),
    "status" "CrmLeadStatus" NOT NULL DEFAULT 'NEW',
    "source" VARCHAR(50),
    "estimated_value" DECIMAL(14,2),
    "notes" TEXT,
    "assigned_to" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "crm_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crm_activities" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "activity_type" VARCHAR(50) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "notes" TEXT,
    "scheduled_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "crm_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_campaigns" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "status" "MarketingCampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "channel" VARCHAR(50),
    "starts_at" TIMESTAMPTZ,
    "ends_at" TIMESTAMPTZ,
    "budget" DECIMAL(14,2),
    "target_audience" TEXT,
    "content" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "marketing_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "status" "OfferStatus" NOT NULL DEFAULT 'DRAFT',
    "discount_type" "DiscountType" NOT NULL,
    "discount_value" DECIMAL(12,4) NOT NULL,
    "image_url" VARCHAR(1000),
    "starts_at" TIMESTAMPTZ,
    "ends_at" TIMESTAMPTZ,
    "terms" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_categories" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "icon_key" VARCHAR(50),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "asset_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "work_order_number" VARCHAR(30) NOT NULL,
    "asset_id" UUID,
    "room_id" UUID,
    "maintenance_request_id" UUID,
    "department" VARCHAR(100),
    "priority" "MaintenancePriority" NOT NULL DEFAULT 'MEDIUM',
    "issue" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "photos" JSONB,
    "assigned_staff_id" UUID,
    "estimated_minutes" INTEGER,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "labor_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "parts_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'NEW',
    "approved_by" UUID,
    "approved_at" TIMESTAMPTZ,
    "attachments" JSONB,
    "is_preventive" BOOLEAN NOT NULL DEFAULT false,
    "pm_plan_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_order_parts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "work_order_id" UUID NOT NULL,
    "inventory_item_id" UUID,
    "part_name" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 1,
    "unit_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "issued_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returned_qty" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_order_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preventive_maintenance_plans" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "frequency" "PmFrequency" NOT NULL DEFAULT 'MONTHLY',
    "meter_threshold" DECIMAL(12,2),
    "next_due_at" TIMESTAMPTZ,
    "last_run_at" TIMESTAMPTZ,
    "checklist" JSONB,
    "estimated_minutes" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "preventive_maintenance_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_amc_contracts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "asset_id" UUID,
    "contract_number" VARCHAR(50) NOT NULL,
    "vendor_name" VARCHAR(255) NOT NULL,
    "coverage" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "renewal_date" DATE,
    "service_visits" INTEGER NOT NULL DEFAULT 0,
    "sla_hours" INTEGER,
    "cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "attachments" JSONB,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "asset_amc_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_warranty_claims" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "claim_number" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "oem_service" VARCHAR(255),
    "status" VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    "claim_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ,
    "cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "attachments" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_warranty_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_inspections" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "work_order_id" UUID,
    "asset_id" UUID,
    "inspection_type" "EamInspectionType" NOT NULL,
    "checklist" JSONB,
    "photos" JSONB,
    "remarks" TEXT,
    "passed" BOOLEAN,
    "approved_by" UUID,
    "approved_at" TIMESTAMPTZ,
    "inspected_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_teams" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "department" VARCHAR(100),
    "lead_staff_id" UUID,
    "member_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "maintenance_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technician_profiles" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "department" VARCHAR(100),
    "avg_response_minutes" INTEGER,
    "completed_jobs" INTEGER NOT NULL DEFAULT 0,
    "performance_score" DECIMAL(5,2),
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "technician_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_history" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "event" "AssetLifecycleStage" NOT NULL,
    "notes" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "asset_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_documents" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "doc_type" VARCHAR(50) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "energy_readings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "utility_type" "EnergyUtilityType" NOT NULL,
    "department" VARCHAR(100),
    "room_id" UUID,
    "reading_value" DECIMAL(14,3) NOT NULL,
    "unit" VARCHAR(20) NOT NULL DEFAULT 'kWh',
    "reading_at" TIMESTAMPTZ NOT NULL,
    "meter_id" VARCHAR(100),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "energy_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_inspection_records" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "equipment_type" "SafetyEquipmentType" NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "asset_id" UUID,
    "last_inspected" TIMESTAMPTZ,
    "next_due" TIMESTAMPTZ,
    "compliance_status" VARCHAR(30) NOT NULL DEFAULT 'COMPLIANT',
    "checklist" JSONB,
    "photos" JSONB,
    "remarks" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "safety_inspection_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "work_order_id" UUID,
    "asset_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "details" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "maintenance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banquet_halls" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "hall_code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "images" JSONB,
    "capacity" INTEGER NOT NULL DEFAULT 100,
    "min_guests" INTEGER NOT NULL DEFAULT 20,
    "max_guests" INTEGER NOT NULL DEFAULT 500,
    "theatre_capacity" INTEGER,
    "classroom_capacity" INTEGER,
    "round_table_capacity" INTEGER,
    "u_shape_capacity" INTEGER,
    "board_room_capacity" INTEGER,
    "floor_plan_url" VARCHAR(1000),
    "tour_360_url" VARCHAR(1000),
    "amenities" JSONB,
    "base_rate" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "banquet_halls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_availability" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "hall_id" UUID NOT NULL,
    "block_date" DATE NOT NULL,
    "start_time" VARCHAR(10),
    "end_time" VARCHAR(10),
    "block_type" "HallCalendarBlockType" NOT NULL DEFAULT 'BLOCKED',
    "event_id" UUID,
    "title" VARCHAR(255),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hall_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_leads" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "lead_code" VARCHAR(30) NOT NULL,
    "client_name" VARCHAR(255) NOT NULL,
    "company" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "event_type" VARCHAR(50) NOT NULL,
    "source" "EventLeadSource" NOT NULL DEFAULT 'PHONE',
    "status" "EventLeadStatus" NOT NULL DEFAULT 'NEW',
    "expected_date" DATE,
    "expected_guests" INTEGER,
    "expected_revenue" DECIMAL(14,2),
    "probability" INTEGER NOT NULL DEFAULT 30,
    "assigned_to" UUID,
    "preferred_hall_id" UUID,
    "notes" TEXT,
    "event_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,

    CONSTRAINT "event_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_clients" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID,
    "client_code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "company" VARCHAR(255),
    "gst_number" VARCHAR(50),
    "pan_number" VARCHAR(20),
    "phone" VARCHAR(30),
    "email" VARCHAR(255),
    "address" TEXT,
    "preferred_hall_id" UUID,
    "special_requirements" TEXT,
    "documents" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "event_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_packages" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "base_price" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "inclusions" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "event_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_quotations" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "quote_number" VARCHAR(30) NOT NULL,
    "lead_id" UUID,
    "client_id" UUID,
    "event_id" UUID,
    "hall_id" UUID,
    "status" "EventQuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "event_date" DATE,
    "guest_count" INTEGER NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "terms" TEXT,
    "valid_until" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "event_quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_quotation_lines" (
    "id" UUID NOT NULL,
    "quotation_id" UUID NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "event_quotation_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_menus" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "event_id" UUID,
    "name" VARCHAR(150) NOT NULL,
    "meal_type" VARCHAR(50) NOT NULL,
    "style" VARCHAR(50) NOT NULL DEFAULT 'buffet',
    "guest_count" INTEGER NOT NULL DEFAULT 0,
    "per_person_rate" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "pos_synced" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "event_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_menu_items" (
    "id" UUID NOT NULL,
    "menu_id" UUID NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "is_veg" BOOLEAN NOT NULL DEFAULT true,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" VARCHAR(255),

    CONSTRAINT "event_menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_tasks" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "owner_id" UUID,
    "owner_name" VARCHAR(100),
    "deadline" TIMESTAMPTZ,
    "status" "EventTaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "EventTaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "event_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_resources" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "total_qty" INTEGER NOT NULL DEFAULT 0,
    "available_qty" INTEGER NOT NULL DEFAULT 0,
    "unit_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "event_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_resource_allocations" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "resource_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "allocated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returned_at" TIMESTAMPTZ,

    CONSTRAINT "event_resource_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_vendors" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "category" "EventVendorCategory" NOT NULL DEFAULT 'OTHER',
    "contact_name" VARCHAR(100),
    "phone" VARCHAR(30),
    "email" VARCHAR(255),
    "rate_card" JSONB,
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "is_preferred" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "event_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_contracts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "client_id" UUID,
    "contract_number" VARCHAR(30) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "terms" TEXT,
    "cancellation_policy" TEXT,
    "force_majeure" TEXT,
    "signed_at" TIMESTAMPTZ,
    "document_url" VARCHAR(1000),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "event_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_payments" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "client_id" UUID,
    "payment_type" "EventPaymentType" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "gst_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "reference" VARCHAR(100),
    "paid_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_seating_plans" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL DEFAULT 'Main Layout',
    "layout" JSONB NOT NULL,
    "guest_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "event_seating_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_checklists" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "event_id" UUID,
    "name" VARCHAR(150) NOT NULL,
    "event_type" VARCHAR(50),
    "is_template" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_checklist_items" (
    "id" UUID NOT NULL,
    "checklist_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" VARCHAR(50),
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "event_checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_room_blocks" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "reservation_id" UUID,
    "guest_category" VARCHAR(50) NOT NULL,
    "guest_name" VARCHAR(255),
    "room_count" INTEGER NOT NULL DEFAULT 1,
    "check_in_date" DATE NOT NULL,
    "check_out_date" DATE NOT NULL,
    "rate" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pms_synced" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_room_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_timeline_entries" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "phase" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "occurred_at" TIMESTAMPTZ NOT NULL,
    "created_by" UUID,

    CONSTRAINT "event_timeline_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_centers" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "department" VARCHAR(100),
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cost_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_years" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_bank_accounts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "account_id" UUID,
    "name" VARCHAR(255) NOT NULL,
    "bank_name" VARCHAR(255),
    "account_number" VARCHAR(50),
    "ifsc_code" VARCHAR(20),
    "type" "FinBankAccountType" NOT NULL DEFAULT 'CURRENT',
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "opening_balance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "current_balance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "fin_bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_bank_transactions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "bank_account_id" UUID NOT NULL,
    "transaction_date" DATE NOT NULL,
    "description" VARCHAR(500),
    "debit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "credit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "balance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "reference" VARCHAR(100),
    "is_reconciled" BOOLEAN NOT NULL DEFAULT false,
    "journal_entry_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fin_bank_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_bank_reconciliations" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "bank_account_id" UUID NOT NULL,
    "statement_date" DATE NOT NULL,
    "book_balance" DECIMAL(14,2) NOT NULL,
    "bank_balance" DECIMAL(14,2) NOT NULL,
    "difference" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "reconciled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fin_bank_reconciliations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_cash_transactions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "type" "FinCashTransactionType" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "description" VARCHAR(500),
    "counter_name" VARCHAR(100),
    "transaction_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "journal_entry_id" UUID,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fin_cash_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_budgets" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "cost_center_id" UUID,
    "fiscal_year" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "budget_amount" DECIMAL(14,2) NOT NULL,
    "spent_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "category" VARCHAR(100),
    "status" "FinApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "fin_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_receivables" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "type" "FinReceivableType" NOT NULL DEFAULT 'GUEST',
    "party_name" VARCHAR(255) NOT NULL,
    "party_ref" UUID,
    "invoice_ref" VARCHAR(100),
    "amount" DECIMAL(14,2) NOT NULL,
    "paid_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "due_date" DATE,
    "status" VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    "source_module" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "fin_receivables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_payables" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "type" "FinPayableType" NOT NULL DEFAULT 'VENDOR',
    "party_name" VARCHAR(255) NOT NULL,
    "party_ref" UUID,
    "bill_ref" VARCHAR(100),
    "amount" DECIMAL(14,2) NOT NULL,
    "paid_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "due_date" DATE,
    "payment_terms" VARCHAR(50),
    "status" VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    "source_module" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "fin_payables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_gst_entries" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "gst_type" "FinGstType" NOT NULL,
    "hsn_sac" VARCHAR(20),
    "taxable_amount" DECIMAL(14,2) NOT NULL,
    "gst_amount" DECIMAL(14,2) NOT NULL,
    "gst_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "period_month" INTEGER NOT NULL,
    "period_year" INTEGER NOT NULL,
    "reference" VARCHAR(100),
    "source_module" VARCHAR(50),
    "source_id" UUID,
    "is_output" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fin_gst_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fin_approvals" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "status" "FinApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "approved_by" UUID,
    "approved_at" TIMESTAMPTZ,
    "remarks" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fin_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "AccountType" NOT NULL,
    "sub_type" "AccountSubType",
    "parent_id" UUID,
    "cost_center_id" UUID,
    "level" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "balance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "opening_balance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_categories" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "expense_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "account_id" UUID,
    "cost_center_id" UUID,
    "expense_number" VARCHAR(30) NOT NULL,
    "status" "ExpenseStatus" NOT NULL DEFAULT 'DRAFT',
    "approval_status" "FinApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "amount" DECIMAL(14,2) NOT NULL,
    "gst_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tds_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    "department" VARCHAR(100),
    "expense_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor_name" VARCHAR(255),
    "source_module" VARCHAR(50),
    "source_id" UUID,
    "receipt_url" VARCHAR(1000),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incomes" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "account_id" UUID,
    "type" "IncomeType" NOT NULL,
    "income_number" VARCHAR(30) NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "description" TEXT,
    "income_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" VARCHAR(100),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "incomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "entry_number" VARCHAR(30) NOT NULL,
    "status" "JournalEntryStatus" NOT NULL DEFAULT 'DRAFT',
    "approval_status" "FinApprovalStatus" NOT NULL DEFAULT 'DRAFT',
    "voucher_type" "FinVoucherType" NOT NULL DEFAULT 'JOURNAL',
    "entry_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "reference" VARCHAR(100),
    "source_module" VARCHAR(50),
    "source_id" UUID,
    "cost_center_id" UUID,
    "financial_year_id" UUID,
    "is_auto_posted" BOOLEAN NOT NULL DEFAULT false,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "posted_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_lines" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "entry_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "debit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "credit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "description" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "journal_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_components" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "type" "SalaryComponentType" NOT NULL,
    "is_fixed" BOOLEAN NOT NULL DEFAULT true,
    "default_value" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "salary_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_runs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "run_number" VARCHAR(30) NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'DRAFT',
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "total_gross" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_net" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "paid_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "payroll_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_lines" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "run_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "gross_pay" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "deductions" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "net_pay" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "breakdown" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "payroll_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "check_in" TIMESTAMPTZ,
    "check_out" TIMESTAMPTZ,
    "hours_worked" DECIMAL(5,2),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "leave_type" VARCHAR(50) NOT NULL,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "reason" TEXT,
    "approved_by" UUID,
    "approved_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shifts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "ShiftType" NOT NULL,
    "start_time" VARCHAR(10) NOT NULL,
    "end_time" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_shifts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "shift_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "staff_shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurants" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "cuisine" VARCHAR(100),
    "location" VARCHAR(255),
    "outlet_type" VARCHAR(50) NOT NULL DEFAULT 'RESTAURANT',
    "gst_number" VARCHAR(30),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_tables" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "table_number" VARCHAR(20) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 4,
    "zone" VARCHAR(50),
    "is_occupied" BOOLEAN NOT NULL DEFAULT false,
    "table_status" "TableStatus" NOT NULL DEFAULT 'AVAILABLE',
    "is_vip" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "restaurant_tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_categories" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "menu_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "image_url" VARCHAR(1000),
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "prep_time_mins" INTEGER,
    "cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "gst_rate" DECIMAL(5,2) NOT NULL DEFAULT 5,
    "item_type" "MenuItemType" NOT NULL DEFAULT 'FOOD',
    "allergens" JSONB,
    "calories" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kitchen_orders" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "bill_id" UUID,
    "restaurant_id" UUID,
    "order_type" "FnbOrderType" NOT NULL DEFAULT 'DINE_IN',
    "room_id" UUID,
    "order_number" VARCHAR(30) NOT NULL,
    "status" "KitchenOrderStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "MaintenancePriority" NOT NULL DEFAULT 'MEDIUM',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "kitchen_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kitchen_order_items" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "menu_item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "status" "KitchenOrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "kitchen_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bills" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "restaurant_id" UUID,
    "table_id" UUID,
    "guest_id" UUID,
    "reservation_id" UUID,
    "room_id" UUID,
    "order_type" "FnbOrderType" NOT NULL DEFAULT 'DINE_IN',
    "waiter_id" UUID,
    "bill_number" VARCHAR(30) NOT NULL,
    "status" "BillStatus" NOT NULL DEFAULT 'OPEN',
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tip_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "custom_notes" TEXT,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "closed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bill_items" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "bill_id" UUID NOT NULL,
    "menu_item_id" UUID,
    "description" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "customizations" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "bill_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID,
    "reservation_id" UUID,
    "bill_id" UUID,
    "invoice_number" VARCHAR(30) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balance_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "due_date" DATE,
    "issued_at" TIMESTAMPTZ,
    "pdf_url" VARCHAR(1000),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID,
    "invoice_id" UUID,
    "reservation_id" UUID,
    "payment_number" VARCHAR(30) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "gateway_ref" VARCHAR(255),
    "gateway_data" JSONB,
    "paid_at" TIMESTAMPTZ,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxes" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "type" "TaxType" NOT NULL,
    "rate" DECIMAL(8,4) NOT NULL,
    "is_inclusive" BOOLEAN NOT NULL DEFAULT false,
    "applies_to" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "taxes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discounts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DECIMAL(12,4) NOT NULL,
    "min_amount" DECIMAL(12,2),
    "max_discount" DECIMAL(12,2),
    "starts_at" TIMESTAMPTZ,
    "ends_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "CouponType" NOT NULL,
    "value" DECIMAL(12,4) NOT NULL,
    "max_uses" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "min_amount" DECIMAL(12,2),
    "starts_at" TIMESTAMPTZ,
    "ends_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_programs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "points_per_rupee" DECIMAL(8,4) NOT NULL DEFAULT 1,
    "redemption_rate" DECIMAL(8,4) NOT NULL DEFAULT 0.25,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "loyalty_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_accounts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "tier" "MembershipTier" NOT NULL DEFAULT 'SILVER',
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "loyalty_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loyalty_transactions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "type" "LoyaltyType" NOT NULL,
    "points" DECIMAL(12,2) NOT NULL,
    "balance_after" DECIMAL(12,2) NOT NULL,
    "reference" VARCHAR(100),
    "description" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "loyalty_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "key_cards" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID,
    "room_id" UUID,
    "guest_id" UUID,
    "card_number" VARCHAR(50) NOT NULL,
    "status" "KeyCardStatus" NOT NULL DEFAULT 'ACTIVE',
    "issued_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deactivated_at" TIMESTAMPTZ,
    "is_duplicate" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "key_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "key_card_access_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "key_card_id" UUID NOT NULL,
    "room_id" UUID,
    "action" VARCHAR(50) NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "key_card_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_requests" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID,
    "guest_id" UUID,
    "room_id" UUID,
    "request_type" "GuestRequestType" NOT NULL,
    "status" "GuestRequestStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "scheduled_at" TIMESTAMPTZ,
    "charge_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "approved_by" UUID,
    "approved_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "guest_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "front_desk_tasks" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID,
    "guest_id" UUID,
    "room_id" UUID,
    "task_type" "FrontDeskTaskType" NOT NULL,
    "status" "FrontDeskTaskStatus" NOT NULL DEFAULT 'PENDING',
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "assigned_to" UUID,
    "priority" "ComplaintPriority" NOT NULL DEFAULT 'MEDIUM',
    "due_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "front_desk_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lost_and_found_items" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "photo_url" VARCHAR(1000),
    "room_id" UUID,
    "guest_id" UUID,
    "guest_name" VARCHAR(255),
    "found_by" VARCHAR(255),
    "location" VARCHAR(255),
    "status" "LostFoundStatus" NOT NULL DEFAULT 'FOUND',
    "found_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returned_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "lost_and_found_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_communications" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID,
    "reservation_id" UUID,
    "channel" "GuestCommunicationChannel" NOT NULL,
    "message_type" "GuestCommunicationType" NOT NULL,
    "recipient" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(500),
    "body" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "sent_at" TIMESTAMPTZ,
    "read_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "guest_communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "front_desk_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "user_id" UUID,
    "action" "FrontDeskLogAction" NOT NULL,
    "entity_type" VARCHAR(50),
    "entity_id" UUID,
    "reservation_id" UUID,
    "description" VARCHAR(500),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "front_desk_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vip_guest_notes" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "preferred_room" VARCHAR(20),
    "welcome_gift" VARCHAR(255),
    "special_amenities" JSONB,
    "dedicated_notes" TEXT,
    "priority_check_in" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "vip_guest_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_portal_sessions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "room_id" UUID,
    "session_token" VARCHAR(64) NOT NULL,
    "language" VARCHAR(10) NOT NULL DEFAULT 'en',
    "expires_at" TIMESTAMPTZ NOT NULL,
    "last_active_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "guest_portal_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_qr_codes" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "token" VARCHAR(64) NOT NULL,
    "qr_data" VARCHAR(255) NOT NULL,
    "scan_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "room_qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gxp_requests" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "session_id" UUID,
    "reservation_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "room_id" UUID,
    "category" "GxpRequestCategory" NOT NULL,
    "sub_type" VARCHAR(100) NOT NULL,
    "status" "GxpRequestStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "scheduled_at" TIMESTAMPTZ,
    "photo_urls" JSONB,
    "metadata" JSONB,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "gxp_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gxp_chat_messages" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "session_id" UUID,
    "reservation_id" UUID NOT NULL,
    "department" "GxpChatDepartment" NOT NULL DEFAULT 'RECEPTION',
    "sender_type" VARCHAR(20) NOT NULL,
    "sender_name" VARCHAR(100),
    "message" TEXT NOT NULL,
    "read_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gxp_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gxp_feedback" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "room_rating" SMALLINT,
    "food_rating" SMALLINT,
    "staff_rating" SMALLINT,
    "housekeeping_rating" SMALLINT,
    "overall_rating" SMALLINT,
    "comments" TEXT,
    "photo_urls" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gxp_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gxp_offers" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "offer_type" VARCHAR(50) NOT NULL,
    "discount_pct" DECIMAL(5,2),
    "image_url" VARCHAR(1000),
    "starts_at" TIMESTAMPTZ,
    "ends_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "gxp_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gxp_announcements" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "priority" VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    "starts_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ends_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "gxp_announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gxp_notifications" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "read_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gxp_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotels" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "brand_name" VARCHAR(255),
    "legal_name" VARCHAR(255),
    "gst_number" VARCHAR(50),
    "pan_number" VARCHAR(20),
    "address_line1" VARCHAR(500),
    "address_line2" VARCHAR(500),
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "country" VARCHAR(100) NOT NULL DEFAULT 'IN',
    "postal_code" VARCHAR(20),
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "phone" VARCHAR(30),
    "email" VARCHAR(255),
    "website" VARCHAR(500),
    "logo_url" VARCHAR(1000),
    "favicon_url" VARCHAR(1000),
    "primary_color" VARCHAR(20) NOT NULL DEFAULT '#001F3F',
    "secondary_color" VARCHAR(20) NOT NULL DEFAULT '#C9A227',
    "accent_color" VARCHAR(20) NOT NULL DEFAULT '#FFFFFF',
    "background_color" VARCHAR(20) NOT NULL DEFAULT '#F5F5F5',
    "font_heading" VARCHAR(100) NOT NULL DEFAULT 'Playfair Display',
    "font_body" VARCHAR(100) NOT NULL DEFAULT 'Inter',
    "subscription_plan" "SubscriptionPlan" NOT NULL DEFAULT 'TRIAL',
    "status" "HotelStatus" NOT NULL DEFAULT 'PENDING_SETUP',
    "check_in_time" VARCHAR(10) NOT NULL DEFAULT '14:00',
    "check_out_time" VARCHAR(10) NOT NULL DEFAULT '11:00',
    "star_rating" SMALLINT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_subscriptions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "max_rooms" INTEGER NOT NULL DEFAULT 50,
    "max_users" INTEGER NOT NULL DEFAULT 25,
    "max_storage_gb" INTEGER NOT NULL DEFAULT 10,
    "enabled_modules" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "billing_cycle" VARCHAR(20) NOT NULL DEFAULT 'monthly',
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "starts_at" TIMESTAMPTZ NOT NULL,
    "ends_at" TIMESTAMPTZ,
    "trial_ends_at" TIMESTAMPTZ,
    "auto_renew" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "hotel_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_settings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "scope" "SettingScope" NOT NULL DEFAULT 'HOTEL',
    "module" VARCHAR(50),
    "key" VARCHAR(100) NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "hotel_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" UUID NOT NULL,
    "hotel_id" UUID,
    "scope" "FeatureFlagScope" NOT NULL DEFAULT 'HOTEL',
    "key" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "plan" "SubscriptionPlan",
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linen_inventory" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "item_name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "total_quantity" INTEGER NOT NULL DEFAULT 0,
    "available" INTEGER NOT NULL DEFAULT 0,
    "in_laundry" INTEGER NOT NULL DEFAULT 0,
    "damaged" INTEGER NOT NULL DEFAULT 0,
    "lost" INTEGER NOT NULL DEFAULT 0,
    "status" "LinenStatus" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "linen_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amenity_refill_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "task_id" UUID,
    "item_name" VARCHAR(100) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "refilled_by" UUID,
    "refilled_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "amenity_refill_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mini_bar_items" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "item_name" VARCHAR(100) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "par_level" INTEGER NOT NULL DEFAULT 2,
    "unit_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "mini_bar_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mini_bar_consumptions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "reservation_id" UUID,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "consumed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "charged" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mini_bar_consumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "housekeeping_inspections" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "supervisor_id" UUID,
    "quality_score" SMALLINT NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "photos" JSONB,
    "checklist" JSONB,
    "inspected_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "housekeeping_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deep_cleaning_schedules" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "frequency" VARCHAR(30) NOT NULL,
    "next_due_date" DATE NOT NULL,
    "last_done_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "deep_cleaning_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_departments" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "parent_id" UUID,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "hr_departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_designations" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "department_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "hr_designations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_profiles" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "date_of_birth" DATE,
    "blood_group" VARCHAR(10),
    "nationality" VARCHAR(100),
    "marital_status" VARCHAR(30),
    "employment_type" "EmploymentType" NOT NULL DEFAULT 'PERMANENT',
    "pan_number" VARCHAR(20),
    "aadhaar_last4" VARCHAR(4),
    "passport_number" VARCHAR(50),
    "driving_license" VARCHAR(50),
    "permanent_address" TEXT,
    "current_address" TEXT,
    "bank_name" VARCHAR(100),
    "bank_account" VARCHAR(50),
    "bank_ifsc" VARCHAR(20),
    "pf_number" VARCHAR(50),
    "esic_number" VARCHAR(50),
    "uan" VARCHAR(50),
    "reporting_manager_id" UUID,
    "skills" JSONB,
    "languages" JSONB,
    "education" JSONB,
    "experience" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "staff_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_openings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "department_id" UUID,
    "designation_id" UUID,
    "status" "JobOpeningStatus" NOT NULL DEFAULT 'OPEN',
    "openings" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "requirements" TEXT,
    "salary_min" DECIMAL(12,2),
    "salary_max" DECIMAL(12,2),
    "posted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closes_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "job_openings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "job_opening_id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "status" "CandidateStatus" NOT NULL DEFAULT 'APPLIED',
    "resume_url" VARCHAR(1000),
    "source" VARCHAR(100),
    "applied_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMPTZ NOT NULL,
    "interviewer" VARCHAR(200),
    "round" INTEGER NOT NULL DEFAULT 1,
    "feedback" TEXT,
    "rating" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_tasks" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "status" "OnboardingTaskStatus" NOT NULL DEFAULT 'PENDING',
    "due_date" DATE,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "onboarding_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_courses" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "duration_hrs" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "is_mandatory" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "training_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_trainings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "status" "TrainingEnrollmentStatus" NOT NULL DEFAULT 'ENROLLED',
    "progress_pct" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "employee_trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_reviews" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "period" VARCHAR(50) NOT NULL,
    "status" "PerformanceReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "kpi_score" DECIMAL(5,2),
    "self_rating" INTEGER,
    "manager_rating" INTEGER,
    "final_score" DECIMAL(5,2),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "performance_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_expense_claims" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "claim_number" VARCHAR(30) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "HrExpenseClaimStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "claim_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by" UUID,
    "approved_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "hr_expense_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exit_processes" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "status" "ExitProcessStatus" NOT NULL DEFAULT 'RESIGNATION_SUBMITTED',
    "resignation_date" DATE NOT NULL,
    "last_working_date" DATE,
    "reason" TEXT,
    "exit_interview" TEXT,
    "clearance_notes" TEXT,
    "settlement_amount" DECIMAL(14,2),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "exit_processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255),
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(30),
    "avatar_url" VARCHAR(1000),
    "gender" "Gender",
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_secret" VARCHAR(255),
    "last_login_at" TIMESTAMPTZ,
    "locked_until" TIMESTAMPTZ,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "hotel_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "code" "UserRoleType" NOT NULL,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "module" VARCHAR(50) NOT NULL,
    "resource" VARCHAR(50) NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "key" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "hotel_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "device_info" VARCHAR(500),
    "ip_address" VARCHAR(45),
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_accounts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "provider_user_id" VARCHAR(255) NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_history" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "hotel_id" UUID,
    "status" "LoginStatus" NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "device" VARCHAR(100),
    "location" VARCHAR(255),
    "failure_reason" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "login_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ota_integrations" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "api_key_encrypted" TEXT,
    "api_secret_encrypted" TEXT,
    "webhook_secret_encrypted" TEXT,
    "hotel_code" VARCHAR(100),
    "webhook_url" VARCHAR(1000),
    "commission_pct" DECIMAL(8,4) NOT NULL DEFAULT 0,
    "default_rate_plan_id" UUID,
    "environment" "ChannelEnvironment" NOT NULL DEFAULT 'SANDBOX',
    "status" "OtaIntegrationStatus" NOT NULL DEFAULT 'INACTIVE',
    "last_sync_at" TIMESTAMPTZ,
    "sync_error" TEXT,
    "config" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ota_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_mappings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "integration_id" UUID NOT NULL,
    "room_type_id" UUID NOT NULL,
    "external_room_code" VARCHAR(100) NOT NULL,
    "external_rate_plan" VARCHAR(100),
    "sync_status" "ChannelSyncStatus" NOT NULL DEFAULT 'PENDING',
    "last_sync_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "channel_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dynamic_price_rules" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_type_id" UUID,
    "name" VARCHAR(100) NOT NULL,
    "min_occupancy" SMALLINT,
    "max_occupancy" SMALLINT,
    "day_of_week" SMALLINT,
    "start_date" DATE,
    "end_date" DATE,
    "adjustment_pct" DECIMAL(8,4) NOT NULL,
    "fixed_rate" DECIMAL(12,2),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "dynamic_price_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_predictions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "type" "AiPredictionType" NOT NULL,
    "model_version" VARCHAR(50),
    "target_date" DATE,
    "predicted_value" DECIMAL(14,4),
    "confidence" DECIMAL(5,4),
    "input_data" JSONB,
    "output_data" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ai_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_revenue_forecasts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "forecast_date" DATE NOT NULL,
    "period" VARCHAR(20) NOT NULL,
    "room_revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "fnb_revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "other_revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "occupancy_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "adr" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "revpar" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "model_version" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ai_revenue_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_recommendation_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "context" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50),
    "entity_id" UUID,
    "recommendation" JSONB NOT NULL,
    "was_accepted" BOOLEAN NOT NULL DEFAULT false,
    "model_version" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ai_recommendation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_definitions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "module" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "query_template" TEXT,
    "parameters" JSONB,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "report_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_runs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "definition_id" UUID NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "parameters" JSONB,
    "result_url" VARCHAR(1000),
    "error_message" TEXT,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "report_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_cache" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "cache_key" VARCHAR(255) NOT NULL,
    "data" JSONB NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "dashboard_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_stores" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "store_type" "InventoryStoreType" NOT NULL DEFAULT 'CUSTOM',
    "location" VARCHAR(255),
    "capacity" DECIMAL(14,2),
    "manager_id" UUID,
    "permissions" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "inventory_stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_balances" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "reserved_qty" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "average_cost" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "last_movement" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "stock_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_batches" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "batch_number" VARCHAR(50) NOT NULL,
    "vendor_batch" VARCHAR(50),
    "serial_number" VARCHAR(100),
    "quantity" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "remaining_qty" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "unit_cost" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "manufacturing_date" DATE,
    "expiry_date" DATE,
    "status" "BatchStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "stock_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transfers" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "transfer_number" VARCHAR(30) NOT NULL,
    "from_store_id" UUID NOT NULL,
    "to_store_id" UUID NOT NULL,
    "status" "TransferStatus" NOT NULL DEFAULT 'DRAFT',
    "requested_by_id" UUID,
    "approved_by_id" UUID,
    "received_by_id" UUID,
    "notes" TEXT,
    "transfer_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "stock_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transfer_items" (
    "id" UUID NOT NULL,
    "transfer_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,
    "batch_number" VARCHAR(50),

    CONSTRAINT "stock_transfer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_issues" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "issue_number" VARCHAR(30) NOT NULL,
    "store_id" UUID NOT NULL,
    "department" "InventoryDepartment" NOT NULL,
    "status" "IssueStatus" NOT NULL DEFAULT 'DRAFT',
    "requested_by_id" UUID,
    "approved_by_id" UUID,
    "issued_by_id" UUID,
    "received_by_id" UUID,
    "notes" TEXT,
    "issue_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "stock_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_issue_items" (
    "id" UUID NOT NULL,
    "issue_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,

    CONSTRAINT "stock_issue_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_consumptions" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "department" "InventoryDepartment" NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,
    "unit_cost" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "reference" VARCHAR(100),
    "source_module" VARCHAR(50),
    "source_id" UUID,
    "notes" TEXT,
    "consumed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_consumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_adjustments" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "adjust_number" VARCHAR(30) NOT NULL,
    "type" "AdjustmentType" NOT NULL,
    "status" "AdjustmentStatus" NOT NULL DEFAULT 'DRAFT',
    "quantity" DECIMAL(14,4) NOT NULL,
    "reason" TEXT,
    "approved_by_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "stock_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_audits" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "store_id" UUID NOT NULL,
    "audit_number" VARCHAR(30) NOT NULL,
    "status" "AuditStatus" NOT NULL DEFAULT 'DRAFT',
    "audit_type" VARCHAR(30) NOT NULL DEFAULT 'cycle',
    "scheduled_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "approved_by_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "stock_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_audit_items" (
    "id" UUID NOT NULL,
    "audit_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "system_qty" DECIMAL(14,4) NOT NULL,
    "physical_qty" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "variance" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "stock_audit_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_purchase_requests" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "request_number" VARCHAR(30) NOT NULL,
    "department" "InventoryDepartment" NOT NULL,
    "status" "PurchaseRequestStatus" NOT NULL DEFAULT 'DRAFT',
    "requested_by_id" UUID,
    "dept_approved_by_id" UUID,
    "store_approved_by_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "inventory_purchase_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_purchase_request_items" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "inventory_purchase_request_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reorder_rules" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "min_level" DECIMAL(14,4) NOT NULL,
    "reorder_qty" DECIMAL(14,4) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "reorder_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "entity" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "details" JSONB,
    "user_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_categories" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "parent_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "inventory_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units_of_measure" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "units_of_measure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "unit_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "item_code" VARCHAR(50),
    "barcode" VARCHAR(100),
    "qr_code" VARCHAR(500),
    "description" TEXT,
    "sub_category_id" UUID,
    "brand" VARCHAR(100),
    "default_store_id" UUID,
    "hsn_code" VARCHAR(20),
    "gst_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "purchase_unit_id" UUID,
    "consumption_unit_id" UUID,
    "current_stock" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "reorder_level" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "min_stock" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "max_stock" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "cost_price" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "selling_price" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "expiry_required" BOOLEAN NOT NULL DEFAULT false,
    "batch_tracking" BOOLEAN NOT NULL DEFAULT false,
    "image_url" VARCHAR(1000),
    "item_status" "InventoryItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "cost_method" "CostMethod" NOT NULL DEFAULT 'WEIGHTED',
    "location" VARCHAR(100),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "address" TEXT,
    "gst_number" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "company_name" VARCHAR(255),
    "category_id" UUID,
    "category" VARCHAR(100),
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "whatsapp" VARCHAR(30),
    "address" TEXT,
    "gst_number" VARCHAR(50),
    "pan_number" VARCHAR(20),
    "msme_number" VARCHAR(50),
    "products_supplied" TEXT,
    "bank_details" JSONB,
    "payment_terms" "PaymentTerms" NOT NULL DEFAULT 'NET_30',
    "credit_limit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "lead_time_days" INTEGER NOT NULL DEFAULT 7,
    "tax_info" JSONB,
    "attachments" JSONB,
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "is_blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "vendor_status" "VendorStatus" NOT NULL DEFAULT 'ACTIVE',
    "portal_user_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "vendor_id" UUID,
    "po_number" VARCHAR(30) NOT NULL,
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "order_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expected_date" DATE,
    "delivery_address" TEXT,
    "payment_terms" "PaymentTerms",
    "discount_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "gst_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "approved_by_id" UUID,
    "approved_at" TIMESTAMPTZ,
    "sent_at" TIMESTAMPTZ,
    "rfq_id" UUID,
    "quotation_id" UUID,
    "purchase_request_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_items" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,
    "unit_price" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "discount" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "gst_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "received_qty" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goods_receipt_notes" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "vendor_id" UUID,
    "store_id" UUID,
    "order_id" UUID,
    "grn_number" VARCHAR(30) NOT NULL,
    "status" "GrnStatus" NOT NULL DEFAULT 'DRAFT',
    "received_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiver_id" UUID,
    "inspection_status" "InspectionStatus" NOT NULL DEFAULT 'PENDING',
    "inspection_notes" TEXT,
    "photos" JSONB,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "goods_receipt_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grn_items" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "grn_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,
    "accepted_qty" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "rejected_qty" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "unit_price" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "batch_number" VARCHAR(50),
    "expiry_date" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "grn_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "store_id" UUID,
    "type" "StockMovementType" NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,
    "balance_after" DECIMAL(14,4) NOT NULL,
    "unit_cost" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "batch_number" VARCHAR(50),
    "department" "InventoryDepartment",
    "reference" VARCHAR(100),
    "reference_id" UUID,
    "notes" TEXT,
    "movement_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID,
    "user_id" UUID,
    "action" "AuditAction" NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID,
    "user_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "module" VARCHAR(50),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID,
    "user_id" UUID,
    "direction" "ApiLogDirection" NOT NULL DEFAULT 'INBOUND',
    "method" VARCHAR(10),
    "path" VARCHAR(500),
    "status_code" INTEGER,
    "duration_ms" INTEGER,
    "request_body" JSONB,
    "response_body" JSONB,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "api_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID,
    "severity" "ErrorSeverity" NOT NULL DEFAULT 'MEDIUM',
    "error_code" VARCHAR(50),
    "message" TEXT NOT NULL,
    "stack_trace" TEXT,
    "module" VARCHAR(50),
    "request_id" VARCHAR(100),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stored_files" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "category" "FileCategory" NOT NULL DEFAULT 'OTHER',
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" VARCHAR(1000) NOT NULL,
    "mime_type" VARCHAR(100),
    "file_size" INTEGER,
    "storage_key" VARCHAR(500),
    "checksum" VARCHAR(64),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "stored_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "entity_type" "AttachmentEntityType" NOT NULL,
    "entity_id" UUID NOT NULL,
    "title" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encrypted_secrets" (
    "id" UUID NOT NULL,
    "hotel_id" UUID,
    "key_name" VARCHAR(100) NOT NULL,
    "encrypted_value" TEXT NOT NULL,
    "algorithm" VARCHAR(20) NOT NULL DEFAULT 'AES-256-GCM',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "encrypted_secrets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "housekeeping_tasks" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "assigned_staff_id" UUID,
    "status" "HousekeepingStatus" NOT NULL DEFAULT 'PENDING',
    "task_type" VARCHAR(50) NOT NULL DEFAULT 'cleaning',
    "priority" "MaintenancePriority" NOT NULL DEFAULT 'MEDIUM',
    "scheduled_at" TIMESTAMPTZ,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "notes" TEXT,
    "estimated_minutes" INTEGER,
    "supervisor_id" UUID,
    "cleaning_score" SMALLINT,
    "photos" JSONB,
    "inspection_remarks" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "housekeeping_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cleaning_checklists" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "room_type" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cleaning_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cleaning_checklist_items" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "checklist_id" UUID NOT NULL,
    "task_id" UUID,
    "item_name" VARCHAR(255) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cleaning_checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laundry_orders" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_id" UUID,
    "guest_id" UUID,
    "order_number" VARCHAR(30) NOT NULL,
    "status" "LaundryStatus" NOT NULL DEFAULT 'COLLECTED',
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "collected_at" TIMESTAMPTZ,
    "delivered_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "laundry_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laundry_items" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "item_name" VARCHAR(100) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "rate" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "service_type" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "laundry_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_requests" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "request_number" VARCHAR(30) NOT NULL,
    "room_id" UUID,
    "asset_id" UUID,
    "assigned_staff_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(100),
    "source" "MaintenanceRequestSource" NOT NULL DEFAULT 'MAINTENANCE_TEAM',
    "issue_category" "CorrectiveType",
    "priority" "MaintenancePriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'OPEN',
    "location" VARCHAR(255),
    "photos" JSONB,
    "video_url" VARCHAR(500),
    "remarks" TEXT,
    "sla_due_at" TIMESTAMPTZ,
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMPTZ,
    "reported_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ,
    "resolution_notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "maintenance_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "employee_code" VARCHAR(50) NOT NULL,
    "department" VARCHAR(100),
    "designation" VARCHAR(100),
    "joining_date" DATE,
    "termination_date" DATE,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "emergency_contact" VARCHAR(30),
    "emergency_name" VARCHAR(100),
    "address" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_documents" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "staff_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "doc_type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "staff_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "user_id" UUID,
    "guest_code" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "alternate_phone" VARCHAR(30),
    "gender" "Gender",
    "date_of_birth" DATE,
    "nationality" VARCHAR(100),
    "country" VARCHAR(100),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "photo_url" VARCHAR(1000),
    "company_name" VARCHAR(255),
    "gst_number" VARCHAR(50),
    "passport_number" VARCHAR(50),
    "aadhaar_hash" VARCHAR(128),
    "anniversary" DATE,
    "vip_status" BOOLEAN NOT NULL DEFAULT false,
    "is_corporate" BOOLEAN NOT NULL DEFAULT false,
    "is_blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "blacklist_reason" VARCHAR(500),
    "membership_tier" "MembershipTier",
    "food_preferences" JSONB,
    "preferences" JSONB,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_documents" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "doc_type" VARCHAR(50) NOT NULL,
    "doc_number" VARCHAR(100),
    "expiry_date" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "guest_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_agents" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "commission_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "address" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "travel_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_bookings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "group_code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "group_type" "GroupBookingType" NOT NULL,
    "contact_name" VARCHAR(255) NOT NULL,
    "contact_phone" VARCHAR(30),
    "contact_email" VARCHAR(255),
    "check_in_date" DATE NOT NULL,
    "check_out_date" DATE NOT NULL,
    "total_rooms" INTEGER NOT NULL DEFAULT 1,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "group_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_blocks" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "reason" "RoomBlockReason" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "room_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_transfers" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "from_room_id" UUID NOT NULL,
    "to_room_id" UUID NOT NULL,
    "transfer_type" VARCHAR(50) NOT NULL,
    "reason" VARCHAR(500),
    "rate_adjustment" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "room_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_status_history" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "from_status" "RoomStatus",
    "to_status" "RoomStatus" NOT NULL,
    "reason" VARCHAR(500),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "room_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_in_records" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "room_id" UUID,
    "current_step" "CheckInStep" NOT NULL DEFAULT 'RESERVATION',
    "key_card_issued" BOOLEAN NOT NULL DEFAULT false,
    "key_card_number" VARCHAR(50),
    "signature_url" VARCHAR(1000),
    "photo_url" VARCHAR(1000),
    "verified_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "check_in_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_cards" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "check_in_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "passport_scan_url" VARCHAR(1000),
    "aadhaar_scan_url" VARCHAR(1000),
    "license_scan_url" VARCHAR(1000),
    "signature_url" VARCHAR(1000),
    "photo_url" VARCHAR(1000),
    "ocr_data" JSONB,
    "auto_filled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "registration_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_out_records" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "room_charges" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "restaurant_charges" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "laundry_charges" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "mini_bar_charges" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "spa_charges" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "loyalty_redemption" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "feedback_rating" SMALLINT,
    "feedback_notes" TEXT,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "check_out_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folio_charges" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "room_id" UUID,
    "category" "FolioChargeCategory" NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "source_ref" VARCHAR(100),
    "posted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "folio_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_line_items" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "hsn_sac" VARCHAR(20),
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "cgst_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sgst_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igst_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "invoice_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "night_audits" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "audit_date" DATE NOT NULL,
    "status" "NightAuditStatus" NOT NULL DEFAULT 'PENDING',
    "room_revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "restaurant_revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_revenue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "occupancy_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "adr" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "rev_par" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "cash_reconciliation" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "open_folios" INTEGER NOT NULL DEFAULT 0,
    "pending_checkouts" INTEGER NOT NULL DEFAULT 0,
    "summary" JSONB,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "night_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_categories" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "vendor_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_contacts" (
    "id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(30),
    "whatsapp" VARCHAR(30),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proc_purchase_requests" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "request_number" VARCHAR(30) NOT NULL,
    "department" "InventoryDepartment" NOT NULL,
    "priority" "ProcPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "ProcPrStatus" NOT NULL DEFAULT 'DRAFT',
    "required_date" DATE,
    "reason" TEXT,
    "remarks" TEXT,
    "attachments" JSONB,
    "requested_by_id" UUID,
    "dept_approved_by_id" UUID,
    "pm_approved_by_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "proc_purchase_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proc_purchase_request_items" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "item_id" UUID,
    "item_name" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,
    "unit" VARCHAR(20),
    "notes" TEXT,

    CONSTRAINT "proc_purchase_request_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfqs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "rfq_number" VARCHAR(30) NOT NULL,
    "purchase_request_id" UUID,
    "status" "RfqStatus" NOT NULL DEFAULT 'DRAFT',
    "expiry_date" TIMESTAMPTZ,
    "deadline" TIMESTAMPTZ,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "rfqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq_items" (
    "id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "item_id" UUID,
    "item_name" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,
    "unit" VARCHAR(20),

    CONSTRAINT "rfq_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfq_vendors" (
    "id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "sent_at" TIMESTAMPTZ,
    "email_sent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "rfq_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_quotations" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "quotation_number" VARCHAR(30) NOT NULL,
    "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "delivery_charges" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "lead_time_days" INTEGER NOT NULL DEFAULT 7,
    "warranty" VARCHAR(255),
    "validity_date" DATE,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "is_recommended" BOOLEAN NOT NULL DEFAULT false,
    "attachments" JSONB,
    "remarks" TEXT,
    "submitted_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "vendor_quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_items" (
    "id" UUID NOT NULL,
    "quotation_id" UUID NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,
    "unit_price" DECIMAL(12,4) NOT NULL,
    "discount" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "gst_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,

    CONSTRAINT "quotation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_returns" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "return_number" VARCHAR(30) NOT NULL,
    "vendor_id" UUID NOT NULL,
    "order_id" UUID,
    "grn_id" UUID,
    "reason" "ReturnReason" NOT NULL,
    "status" "ReturnStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "purchase_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_return_items" (
    "id" UUID NOT NULL,
    "return_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "purchase_return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_contracts" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "contract_number" VARCHAR(30) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "renewal_date" DATE,
    "pricing" JSONB,
    "terms" TEXT,
    "attachments" JSONB,
    "auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "vendor_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_ratings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "on_time_delivery_score" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "quality_score" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "price_score" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "response_time_score" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "overall_rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "rejected_deliveries" INTEGER NOT NULL DEFAULT 0,
    "avg_lead_time_days" INTEGER NOT NULL DEFAULT 0,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_budgets" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "department" "InventoryDepartment" NOT NULL,
    "fiscal_year" INTEGER NOT NULL,
    "budget_amount" DECIMAL(14,2) NOT NULL,
    "spent_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "procurement_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_approvals" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "level" "ApprovalLevel" NOT NULL,
    "approver_id" UUID,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "acted_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "procurement_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_invoices" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "order_id" UUID,
    "invoice_number" VARCHAR(50) NOT NULL,
    "status" "VendorInvoiceStatus" NOT NULL DEFAULT 'SUBMITTED',
    "invoice_date" DATE NOT NULL,
    "due_date" DATE,
    "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "gst_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "matched_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "attachments" JSONB,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "vendor_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_invoice_items" (
    "id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL(14,4) NOT NULL,
    "unit_price" DECIMAL(12,4) NOT NULL,
    "gst_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,

    CONSTRAINT "vendor_invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procurement_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "entity" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "details" JSONB,
    "user_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "procurement_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "floors" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "building_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "floor_number" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_types" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "base_rate" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "max_occupancy" INTEGER NOT NULL DEFAULT 2,
    "max_adults" INTEGER NOT NULL DEFAULT 2,
    "max_children" INTEGER NOT NULL DEFAULT 0,
    "size_sqm" DECIMAL(8,2),
    "bed_type" VARCHAR(50),
    "view_type" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "room_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amenities" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(50),
    "category" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_type_amenities" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_type_id" UUID NOT NULL,
    "amenity_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "room_type_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_images" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_type_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "room_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "floor_id" UUID NOT NULL,
    "room_type_id" UUID NOT NULL,
    "room_number" VARCHAR(20) NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'VACANT_CLEAN',
    "category" "RoomCategory" NOT NULL DEFAULT 'STANDARD',
    "is_smoking" BOOLEAN NOT NULL DEFAULT false,
    "is_accessible" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "qr_code" VARCHAR(100),
    "barcode" VARCHAR(100),
    "category" VARCHAR(100),
    "category_id" UUID,
    "department" VARCHAR(100),
    "location" VARCHAR(255),
    "building" VARCHAR(100),
    "floor" VARCHAR(50),
    "room_id" UUID,
    "serial_number" VARCHAR(100),
    "manufacturer" VARCHAR(255),
    "model" VARCHAR(255),
    "vendor_name" VARCHAR(255),
    "purchase_date" DATE,
    "installation_date" DATE,
    "warranty_start" DATE,
    "warranty_end" DATE,
    "amc_start" DATE,
    "amc_end" DATE,
    "purchase_cost" DECIMAL(12,2),
    "current_value" DECIMAL(12,2),
    "useful_life_years" INTEGER,
    "depreciation_method" "DepreciationMethod",
    "lifecycle_stage" "AssetLifecycleStage" NOT NULL DEFAULT 'PURCHASED',
    "status" "AssetStatus" NOT NULL DEFAULT 'ACTIVE',
    "warranty_until" DATE,
    "image_url" VARCHAR(500),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "room_id" UUID,
    "room_type_id" UUID NOT NULL,
    "reservation_code" VARCHAR(30) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "source" "BookingSource" NOT NULL DEFAULT 'DIRECT_WEBSITE',
    "check_in_date" DATE NOT NULL,
    "check_out_date" DATE NOT NULL,
    "actual_check_in" TIMESTAMPTZ,
    "actual_check_out" TIMESTAMPTZ,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "room_rate" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paid_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balance_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "special_requests" TEXT,
    "internal_notes" TEXT,
    "ota_reference" VARCHAR(100),
    "corporate_booking_id" UUID,
    "group_booking_id" UUID,
    "travel_agent_id" UUID,
    "waitlist_priority" INTEGER,
    "is_guaranteed" BOOLEAN NOT NULL DEFAULT false,
    "coupon_id" UUID,
    "offer_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_history" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "from_status" "ReservationStatus",
    "to_status" "ReservationStatus" NOT NULL,
    "change_reason" VARCHAR(500),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "reservation_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_recipes" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "menu_item_id" UUID NOT NULL,
    "ingredients" JSONB NOT NULL,
    "prep_time_mins" INTEGER NOT NULL DEFAULT 15,
    "cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "menu_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fnb_feedback" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "bill_id" UUID,
    "guest_id" UUID,
    "food_rating" SMALLINT,
    "service_rating" SMALLINT,
    "ambience_rating" SMALLINT,
    "comments" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fnb_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waiter_tips" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "bill_id" UUID NOT NULL,
    "waiter_id" UUID,
    "amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waiter_tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_inspections" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "quality_score" SMALLINT NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "checklist" JSONB,
    "photos" JSONB,
    "approved_by" UUID,
    "approved_at" TIMESTAMPTZ,
    "inspected_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "room_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_damages" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "estimated_cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "recovery_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "repair_status" VARCHAR(30) NOT NULL DEFAULT 'REPORTED',
    "responsible_guest_id" UUID,
    "photos" JSONB,
    "reported_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "room_damages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_assets" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "asset_type" VARCHAR(100) NOT NULL,
    "serial_number" VARCHAR(100),
    "purchase_date" DATE,
    "warranty_until" DATE,
    "amc_until" DATE,
    "condition" VARCHAR(30) NOT NULL DEFAULT 'GOOD',
    "replacement_date" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "room_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "driver_code" VARCHAR(30) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "photo_url" VARCHAR(500),
    "license_number" VARCHAR(50) NOT NULL,
    "badge_number" VARCHAR(30),
    "experience_years" INTEGER NOT NULL DEFAULT 0,
    "languages" VARCHAR(255),
    "phone" VARCHAR(30) NOT NULL,
    "email" VARCHAR(255),
    "emergency_contact" VARCHAR(100),
    "emergency_phone" VARCHAR(30),
    "shift" VARCHAR(50),
    "current_vehicle_id" UUID,
    "performance_score" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "training_notes" TEXT,
    "is_on_duty" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "trip_number" VARCHAR(30) NOT NULL,
    "travel_request_id" UUID,
    "reservation_id" UUID,
    "guest_id" UUID,
    "guest_name" VARCHAR(255) NOT NULL,
    "guest_phone" VARCHAR(30),
    "booking_id" VARCHAR(50),
    "trip_type" VARCHAR(50) NOT NULL,
    "request_source" VARCHAR(50) NOT NULL DEFAULT 'TRAVEL_DESK',
    "pickup_location" VARCHAR(500) NOT NULL,
    "drop_location" VARCHAR(500) NOT NULL,
    "vehicle_id" UUID,
    "driver_id" UUID,
    "scheduled_at" TIMESTAMPTZ NOT NULL,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "distance_km" DECIMAL(10,2),
    "estimated_minutes" INTEGER,
    "status" "TripStatus" NOT NULL DEFAULT 'REQUESTED',
    "fare" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "payment_status" "TripPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "special_instructions" TEXT,
    "is_vip" BOOLEAN NOT NULL DEFAULT false,
    "is_emergency" BOOLEAN NOT NULL DEFAULT false,
    "corporate_company_id" UUID,
    "rating" INTEGER,
    "feedback" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_stops" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "stop_order" INTEGER NOT NULL,
    "location" VARCHAR(500) NOT NULL,
    "scheduled_at" TIMESTAMPTZ,
    "arrived_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airport_transfer_details" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "flight_number" VARCHAR(20),
    "airline" VARCHAR(100),
    "terminal" VARCHAR(50),
    "transfer_type" VARCHAR(20) NOT NULL DEFAULT 'arrival',
    "arrival_time" TIMESTAMPTZ,
    "departure_time" TIMESTAMPTZ,
    "meet_and_greet" BOOLEAN NOT NULL DEFAULT false,
    "luggage_assist" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "airport_transfer_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_vendors" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "vendor_type" VARCHAR(50) NOT NULL,
    "contact_name" VARCHAR(100),
    "phone" VARCHAR(30),
    "email" VARCHAR(255),
    "contract_rate" DECIMAL(12,2),
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "travel_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fuel_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "fill_date" TIMESTAMPTZ NOT NULL,
    "liters" DECIMAL(10,2) NOT NULL,
    "cost" DECIMAL(12,2) NOT NULL,
    "odometer" INTEGER,
    "mileage" DECIMAL(6,2),
    "station_name" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "fuel_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_expenses" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "expense_type" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "expense_date" TIMESTAMPTZ NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "vehicle_expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_maintenance_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "maintenance_type" VARCHAR(50) NOT NULL,
    "scheduled_date" TIMESTAMPTZ NOT NULL,
    "completed_date" TIMESTAMPTZ,
    "cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "odometer" INTEGER,
    "notes" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    "eam_work_order_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_maintenance_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gps_logs" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "vehicle_id" UUID,
    "driver_id" UUID,
    "trip_id" UUID,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "speed" DECIMAL(6,2),
    "heading" DECIMAL(6,2),
    "recorded_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gps_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_payments" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "payment_method" VARCHAR(30) NOT NULL,
    "payment_status" "TripPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" VARCHAR(100),
    "paid_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_attendance" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "driver_id" UUID NOT NULL,
    "shift_date" DATE NOT NULL,
    "check_in" TIMESTAMPTZ,
    "check_out" TIMESTAMPTZ,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PRESENT',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "driver_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shuttle_routes" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "stops" JSONB NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "shuttle_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shuttle_schedules" (
    "id" UUID NOT NULL,
    "hotel_id" UUID NOT NULL,
    "route_id" UUID NOT NULL,
    "vehicle_id" UUID,
    "driver_id" UUID,
    "day_of_week" INTEGER NOT NULL,
    "depart_time" VARCHAR(10) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 12,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shuttle_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "otp_verifications_identifier_purpose_expires_at_idx" ON "otp_verifications"("identifier", "purpose", "expires_at");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_expires_at_idx" ON "user_sessions"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_revoked_at_idx" ON "user_sessions"("user_id", "revoked_at");

-- CreateIndex
CREATE UNIQUE INDEX "trusted_devices_user_id_fingerprint_key" ON "trusted_devices"("user_id", "fingerprint");

-- CreateIndex
CREATE INDEX "api_keys_key_prefix_idx" ON "api_keys"("key_prefix");

-- CreateIndex
CREATE INDEX "api_keys_hotel_id_idx" ON "api_keys"("hotel_id");

-- CreateIndex
CREATE INDEX "security_events_user_id_created_at_idx" ON "security_events"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "security_events_event_type_created_at_idx" ON "security_events"("event_type", "created_at" DESC);

-- CreateIndex
CREATE INDEX "password_history_user_id_created_at_idx" ON "password_history"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "token_blacklist_jti_key" ON "token_blacklist"("jti");

-- CreateIndex
CREATE INDEX "token_blacklist_expires_at_idx" ON "token_blacklist"("expires_at");

-- CreateIndex
CREATE INDEX "rate_plans_hotel_id_room_type_id_is_active_idx" ON "rate_plans"("hotel_id", "room_type_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "rate_plans_hotel_id_code_key" ON "rate_plans"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "booking_addons_hotel_id_category_is_active_idx" ON "booking_addons"("hotel_id", "category", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "booking_addons_hotel_id_code_key" ON "booking_addons"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "booking_addon_selections_hotel_id_reservation_id_idx" ON "booking_addon_selections"("hotel_id", "reservation_id");

-- CreateIndex
CREATE INDEX "inventory_holds_hotel_id_room_type_id_check_in_date_check_o_idx" ON "inventory_holds"("hotel_id", "room_type_id", "check_in_date", "check_out_date", "status");

-- CreateIndex
CREATE INDEX "inventory_holds_session_id_status_idx" ON "inventory_holds"("session_id", "status");

-- CreateIndex
CREATE INDEX "inventory_holds_expires_at_status_idx" ON "inventory_holds"("expires_at", "status");

-- CreateIndex
CREATE INDEX "booking_events_hotel_id_reservation_id_created_at_idx" ON "booking_events"("hotel_id", "reservation_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "booking_events_hotel_id_event_type_idx" ON "booking_events"("hotel_id", "event_type");

-- CreateIndex
CREATE INDEX "channel_rate_plan_mappings_hotel_id_integration_id_idx" ON "channel_rate_plan_mappings"("hotel_id", "integration_id");

-- CreateIndex
CREATE UNIQUE INDEX "channel_rate_plan_mappings_hotel_id_integration_id_external_key" ON "channel_rate_plan_mappings"("hotel_id", "integration_id", "external_rate_code");

-- CreateIndex
CREATE INDEX "channel_restrictions_hotel_id_start_date_end_date_idx" ON "channel_restrictions"("hotel_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "channel_sync_logs_hotel_id_integration_id_created_at_idx" ON "channel_sync_logs"("hotel_id", "integration_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "channel_sync_logs_hotel_id_status_idx" ON "channel_sync_logs"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "channel_webhook_events_hotel_id_event_type_created_at_idx" ON "channel_webhook_events"("hotel_id", "event_type", "created_at" DESC);

-- CreateIndex
CREATE INDEX "channel_webhook_events_hotel_id_processed_idx" ON "channel_webhook_events"("hotel_id", "processed");

-- CreateIndex
CREATE INDEX "channel_webhook_events_external_ref_idx" ON "channel_webhook_events"("external_ref");

-- CreateIndex
CREATE INDEX "channel_commission_logs_hotel_id_integration_id_idx" ON "channel_commission_logs"("hotel_id", "integration_id");

-- CreateIndex
CREATE INDEX "channel_commission_logs_hotel_id_is_paid_idx" ON "channel_commission_logs"("hotel_id", "is_paid");

-- CreateIndex
CREATE INDEX "channel_sync_jobs_hotel_id_status_priority_scheduled_at_idx" ON "channel_sync_jobs"("hotel_id", "status", "priority", "scheduled_at");

-- CreateIndex
CREATE INDEX "channel_sync_jobs_status_scheduled_at_idx" ON "channel_sync_jobs"("status", "scheduled_at");

-- CreateIndex
CREATE INDEX "cms_pages_hotel_id_status_idx" ON "cms_pages"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "cms_pages_hotel_id_page_type_idx" ON "cms_pages"("hotel_id", "page_type");

-- CreateIndex
CREATE UNIQUE INDEX "cms_pages_hotel_id_slug_key" ON "cms_pages"("hotel_id", "slug");

-- CreateIndex
CREATE INDEX "cms_sections_hotel_id_section_key_idx" ON "cms_sections"("hotel_id", "section_key");

-- CreateIndex
CREATE INDEX "cms_sections_page_id_idx" ON "cms_sections"("page_id");

-- CreateIndex
CREATE INDEX "cms_hero_slides_hotel_id_status_sort_order_idx" ON "cms_hero_slides"("hotel_id", "status", "sort_order");

-- CreateIndex
CREATE INDEX "cms_website_rooms_hotel_id_room_type_id_idx" ON "cms_website_rooms"("hotel_id", "room_type_id");

-- CreateIndex
CREATE INDEX "cms_website_rooms_hotel_id_status_is_featured_idx" ON "cms_website_rooms"("hotel_id", "status", "is_featured");

-- CreateIndex
CREATE UNIQUE INDEX "cms_website_rooms_hotel_id_slug_key" ON "cms_website_rooms"("hotel_id", "slug");

-- CreateIndex
CREATE INDEX "cms_offers_hotel_id_status_offer_type_idx" ON "cms_offers"("hotel_id", "status", "offer_type");

-- CreateIndex
CREATE UNIQUE INDEX "cms_offers_hotel_id_slug_key" ON "cms_offers"("hotel_id", "slug");

-- CreateIndex
CREATE INDEX "cms_gallery_items_hotel_id_album_id_category_idx" ON "cms_gallery_items"("hotel_id", "album_id", "category");

-- CreateIndex
CREATE INDEX "cms_testimonials_hotel_id_status_is_featured_idx" ON "cms_testimonials"("hotel_id", "status", "is_featured");

-- CreateIndex
CREATE INDEX "cms_media_folders_hotel_id_parent_id_idx" ON "cms_media_folders"("hotel_id", "parent_id");

-- CreateIndex
CREATE INDEX "cms_media_albums_hotel_id_idx" ON "cms_media_albums"("hotel_id");

-- CreateIndex
CREATE INDEX "cms_media_files_hotel_id_folder_id_media_type_idx" ON "cms_media_files"("hotel_id", "folder_id", "media_type");

-- CreateIndex
CREATE UNIQUE INDEX "cms_seo_page_id_key" ON "cms_seo"("page_id");

-- CreateIndex
CREATE UNIQUE INDEX "cms_seo_room_id_key" ON "cms_seo"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "cms_seo_offer_id_key" ON "cms_seo"("offer_id");

-- CreateIndex
CREATE INDEX "cms_seo_hotel_id_idx" ON "cms_seo"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "cms_menus_hotel_id_menu_key_key" ON "cms_menus"("hotel_id", "menu_key");

-- CreateIndex
CREATE INDEX "cms_forms_hotel_id_form_type_idx" ON "cms_forms"("hotel_id", "form_type");

-- CreateIndex
CREATE INDEX "cms_form_submissions_hotel_id_form_id_idx" ON "cms_form_submissions"("hotel_id", "form_id");

-- CreateIndex
CREATE INDEX "cms_newsletter_subscribers_hotel_id_is_active_idx" ON "cms_newsletter_subscribers"("hotel_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "cms_newsletter_subscribers_hotel_id_email_key" ON "cms_newsletter_subscribers"("hotel_id", "email");

-- CreateIndex
CREATE INDEX "cms_blog_posts_hotel_id_status_idx" ON "cms_blog_posts"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "cms_blog_posts_hotel_id_slug_key" ON "cms_blog_posts"("hotel_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "cms_blog_categories_hotel_id_slug_key" ON "cms_blog_categories"("hotel_id", "slug");

-- CreateIndex
CREATE INDEX "cms_revisions_page_id_version_idx" ON "cms_revisions"("page_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "cms_website_settings_hotel_id_key" ON "cms_website_settings"("hotel_id");

-- CreateIndex
CREATE INDEX "corp_sales_leads_hotel_id_status_idx" ON "corp_sales_leads"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "corp_sales_leads_hotel_id_lead_code_key" ON "corp_sales_leads"("hotel_id", "lead_code");

-- CreateIndex
CREATE INDEX "corp_company_contacts_hotel_id_company_id_idx" ON "corp_company_contacts"("hotel_id", "company_id");

-- CreateIndex
CREATE INDEX "corp_account_teams_hotel_id_company_id_idx" ON "corp_account_teams"("hotel_id", "company_id");

-- CreateIndex
CREATE INDEX "corp_sales_meetings_hotel_id_company_id_meeting_date_idx" ON "corp_sales_meetings"("hotel_id", "company_id", "meeting_date");

-- CreateIndex
CREATE INDEX "corp_sales_activities_hotel_id_company_id_occurred_at_idx" ON "corp_sales_activities"("hotel_id", "company_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "corp_rate_plans_hotel_id_company_id_status_idx" ON "corp_rate_plans"("hotel_id", "company_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "corp_rate_plans_hotel_id_code_key" ON "corp_rate_plans"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "corp_room_allocations_hotel_id_company_id_start_date_idx" ON "corp_room_allocations"("hotel_id", "company_id", "start_date");

-- CreateIndex
CREATE INDEX "corp_sales_tasks_hotel_id_status_due_date_idx" ON "corp_sales_tasks"("hotel_id", "status", "due_date");

-- CreateIndex
CREATE INDEX "corp_sales_documents_hotel_id_company_id_document_type_idx" ON "corp_sales_documents"("hotel_id", "company_id", "document_type");

-- CreateIndex
CREATE UNIQUE INDEX "corp_credit_accounts_company_id_key" ON "corp_credit_accounts"("company_id");

-- CreateIndex
CREATE INDEX "corp_credit_accounts_hotel_id_idx" ON "corp_credit_accounts"("hotel_id");

-- CreateIndex
CREATE INDEX "corp_billing_invoices_hotel_id_company_id_status_idx" ON "corp_billing_invoices"("hotel_id", "company_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "corp_billing_invoices_hotel_id_invoice_number_key" ON "corp_billing_invoices"("hotel_id", "invoice_number");

-- CreateIndex
CREATE INDEX "corp_billing_payments_hotel_id_company_id_paid_at_idx" ON "corp_billing_payments"("hotel_id", "company_id", "paid_at");

-- CreateIndex
CREATE INDEX "corp_contract_renewals_hotel_id_expiry_date_idx" ON "corp_contract_renewals"("hotel_id", "expiry_date");

-- CreateIndex
CREATE INDEX "corp_sales_targets_hotel_id_period_label_idx" ON "corp_sales_targets"("hotel_id", "period_label");

-- CreateIndex
CREATE INDEX "corp_sales_commissions_hotel_id_status_idx" ON "corp_sales_commissions"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "corp_approval_requests_hotel_id_company_id_status_idx" ON "corp_approval_requests"("hotel_id", "company_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "corporate_companies_hotel_id_code_key" ON "corporate_companies"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "corporate_contracts_hotel_id_company_id_idx" ON "corporate_contracts"("hotel_id", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "corporate_contracts_hotel_id_contract_number_key" ON "corporate_contracts"("hotel_id", "contract_number");

-- CreateIndex
CREATE INDEX "corporate_employees_hotel_id_company_id_idx" ON "corporate_employees"("hotel_id", "company_id");

-- CreateIndex
CREATE INDEX "corporate_bookings_hotel_id_company_id_idx" ON "corporate_bookings"("hotel_id", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "corporate_bookings_hotel_id_booking_code_key" ON "corporate_bookings"("hotel_id", "booking_code");

-- CreateIndex
CREATE INDEX "events_hotel_id_status_idx" ON "events"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "events_hotel_id_event_code_key" ON "events"("hotel_id", "event_code");

-- CreateIndex
CREATE INDEX "banquet_bookings_hotel_id_event_id_idx" ON "banquet_bookings"("hotel_id", "event_id");

-- CreateIndex
CREATE INDEX "travel_desk_requests_hotel_id_status_idx" ON "travel_desk_requests"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "vehicles_hotel_id_status_idx" ON "vehicles"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_hotel_id_vehicle_number_key" ON "vehicles"("hotel_id", "vehicle_number");

-- CreateIndex
CREATE INDEX "airport_pickups_hotel_id_status_idx" ON "airport_pickups"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "airport_pickups_hotel_id_scheduled_at_idx" ON "airport_pickups"("hotel_id", "scheduled_at");

-- CreateIndex
CREATE UNIQUE INDEX "parking_slots_hotel_id_slot_number_key" ON "parking_slots"("hotel_id", "slot_number");

-- CreateIndex
CREATE INDEX "parking_records_hotel_id_slot_id_idx" ON "parking_records"("hotel_id", "slot_id");

-- CreateIndex
CREATE INDEX "parking_records_hotel_id_entry_at_idx" ON "parking_records"("hotel_id", "entry_at");

-- CreateIndex
CREATE INDEX "guest_timeline_events_hotel_id_guest_id_occurred_at_idx" ON "guest_timeline_events"("hotel_id", "guest_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "guest_crm_notes_hotel_id_guest_id_idx" ON "guest_crm_notes"("hotel_id", "guest_id");

-- CreateIndex
CREATE INDEX "referrals_hotel_id_status_idx" ON "referrals"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "referrals_hotel_id_referral_code_idx" ON "referrals"("hotel_id", "referral_code");

-- CreateIndex
CREATE INDEX "gift_cards_hotel_id_status_idx" ON "gift_cards"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "gift_cards_hotel_id_code_key" ON "gift_cards"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "marketing_automations_hotel_id_is_active_idx" ON "marketing_automations"("hotel_id", "is_active");

-- CreateIndex
CREATE INDEX "notifications_hotel_id_user_id_status_idx" ON "notifications"("hotel_id", "user_id", "status");

-- CreateIndex
CREATE INDEX "notifications_hotel_id_created_at_idx" ON "notifications"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "whatsapp_logs_hotel_id_created_at_idx" ON "whatsapp_logs"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "whatsapp_logs_hotel_id_status_idx" ON "whatsapp_logs"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "email_logs_hotel_id_created_at_idx" ON "email_logs"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "sms_logs_hotel_id_created_at_idx" ON "sms_logs"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "feedbacks_hotel_id_type_idx" ON "feedbacks"("hotel_id", "type");

-- CreateIndex
CREATE INDEX "reviews_hotel_id_is_published_idx" ON "reviews"("hotel_id", "is_published");

-- CreateIndex
CREATE INDEX "reviews_hotel_id_rating_idx" ON "reviews"("hotel_id", "rating");

-- CreateIndex
CREATE INDEX "complaints_hotel_id_status_idx" ON "complaints"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "complaints_hotel_id_priority_idx" ON "complaints"("hotel_id", "priority");

-- CreateIndex
CREATE INDEX "crm_leads_hotel_id_status_idx" ON "crm_leads"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "crm_activities_hotel_id_lead_id_idx" ON "crm_activities"("hotel_id", "lead_id");

-- CreateIndex
CREATE INDEX "marketing_campaigns_hotel_id_status_idx" ON "marketing_campaigns"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_campaigns_hotel_id_code_key" ON "marketing_campaigns"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "offers_hotel_id_status_idx" ON "offers"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "offers_hotel_id_code_key" ON "offers"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "asset_categories_hotel_id_idx" ON "asset_categories"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "asset_categories_hotel_id_code_key" ON "asset_categories"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "work_orders_hotel_id_status_idx" ON "work_orders"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "work_orders_hotel_id_priority_idx" ON "work_orders"("hotel_id", "priority");

-- CreateIndex
CREATE INDEX "work_orders_hotel_id_asset_id_idx" ON "work_orders"("hotel_id", "asset_id");

-- CreateIndex
CREATE INDEX "work_orders_hotel_id_assigned_staff_id_idx" ON "work_orders"("hotel_id", "assigned_staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_hotel_id_work_order_number_key" ON "work_orders"("hotel_id", "work_order_number");

-- CreateIndex
CREATE INDEX "work_order_parts_hotel_id_work_order_id_idx" ON "work_order_parts"("hotel_id", "work_order_id");

-- CreateIndex
CREATE INDEX "preventive_maintenance_plans_hotel_id_asset_id_idx" ON "preventive_maintenance_plans"("hotel_id", "asset_id");

-- CreateIndex
CREATE INDEX "preventive_maintenance_plans_hotel_id_next_due_at_idx" ON "preventive_maintenance_plans"("hotel_id", "next_due_at");

-- CreateIndex
CREATE INDEX "asset_amc_contracts_hotel_id_end_date_idx" ON "asset_amc_contracts"("hotel_id", "end_date");

-- CreateIndex
CREATE UNIQUE INDEX "asset_amc_contracts_hotel_id_contract_number_key" ON "asset_amc_contracts"("hotel_id", "contract_number");

-- CreateIndex
CREATE INDEX "asset_warranty_claims_hotel_id_asset_id_idx" ON "asset_warranty_claims"("hotel_id", "asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "asset_warranty_claims_hotel_id_claim_number_key" ON "asset_warranty_claims"("hotel_id", "claim_number");

-- CreateIndex
CREATE INDEX "maintenance_inspections_hotel_id_asset_id_idx" ON "maintenance_inspections"("hotel_id", "asset_id");

-- CreateIndex
CREATE INDEX "maintenance_teams_hotel_id_idx" ON "maintenance_teams"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "technician_profiles_staff_id_key" ON "technician_profiles"("staff_id");

-- CreateIndex
CREATE INDEX "technician_profiles_hotel_id_idx" ON "technician_profiles"("hotel_id");

-- CreateIndex
CREATE INDEX "asset_history_hotel_id_asset_id_created_at_idx" ON "asset_history"("hotel_id", "asset_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "asset_documents_hotel_id_asset_id_idx" ON "asset_documents"("hotel_id", "asset_id");

-- CreateIndex
CREATE INDEX "energy_readings_hotel_id_utility_type_reading_at_idx" ON "energy_readings"("hotel_id", "utility_type", "reading_at" DESC);

-- CreateIndex
CREATE INDEX "safety_inspection_records_hotel_id_equipment_type_idx" ON "safety_inspection_records"("hotel_id", "equipment_type");

-- CreateIndex
CREATE INDEX "maintenance_logs_hotel_id_created_at_idx" ON "maintenance_logs"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "banquet_halls_hotel_id_is_active_idx" ON "banquet_halls"("hotel_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "banquet_halls_hotel_id_hall_code_key" ON "banquet_halls"("hotel_id", "hall_code");

-- CreateIndex
CREATE INDEX "hall_availability_hotel_id_hall_id_block_date_idx" ON "hall_availability"("hotel_id", "hall_id", "block_date");

-- CreateIndex
CREATE INDEX "event_leads_hotel_id_status_idx" ON "event_leads"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "event_leads_hotel_id_source_idx" ON "event_leads"("hotel_id", "source");

-- CreateIndex
CREATE UNIQUE INDEX "event_leads_hotel_id_lead_code_key" ON "event_leads"("hotel_id", "lead_code");

-- CreateIndex
CREATE INDEX "event_clients_hotel_id_guest_id_idx" ON "event_clients"("hotel_id", "guest_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_clients_hotel_id_client_code_key" ON "event_clients"("hotel_id", "client_code");

-- CreateIndex
CREATE INDEX "event_packages_hotel_id_event_type_idx" ON "event_packages"("hotel_id", "event_type");

-- CreateIndex
CREATE UNIQUE INDEX "event_packages_hotel_id_code_key" ON "event_packages"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "event_quotations_hotel_id_status_idx" ON "event_quotations"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "event_quotations_hotel_id_quote_number_key" ON "event_quotations"("hotel_id", "quote_number");

-- CreateIndex
CREATE INDEX "event_quotation_lines_quotation_id_idx" ON "event_quotation_lines"("quotation_id");

-- CreateIndex
CREATE INDEX "event_menus_hotel_id_event_id_idx" ON "event_menus"("hotel_id", "event_id");

-- CreateIndex
CREATE INDEX "event_menu_items_menu_id_idx" ON "event_menu_items"("menu_id");

-- CreateIndex
CREATE INDEX "event_tasks_hotel_id_event_id_status_idx" ON "event_tasks"("hotel_id", "event_id", "status");

-- CreateIndex
CREATE INDEX "event_resources_hotel_id_category_idx" ON "event_resources"("hotel_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "event_resources_hotel_id_code_key" ON "event_resources"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "event_resource_allocations_hotel_id_event_id_idx" ON "event_resource_allocations"("hotel_id", "event_id");

-- CreateIndex
CREATE INDEX "event_vendors_hotel_id_category_idx" ON "event_vendors"("hotel_id", "category");

-- CreateIndex
CREATE INDEX "event_contracts_hotel_id_event_id_idx" ON "event_contracts"("hotel_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_contracts_hotel_id_contract_number_key" ON "event_contracts"("hotel_id", "contract_number");

-- CreateIndex
CREATE INDEX "event_payments_hotel_id_event_id_idx" ON "event_payments"("hotel_id", "event_id");

-- CreateIndex
CREATE INDEX "event_seating_plans_hotel_id_event_id_idx" ON "event_seating_plans"("hotel_id", "event_id");

-- CreateIndex
CREATE INDEX "event_checklists_hotel_id_is_template_idx" ON "event_checklists"("hotel_id", "is_template");

-- CreateIndex
CREATE INDEX "event_checklist_items_checklist_id_idx" ON "event_checklist_items"("checklist_id");

-- CreateIndex
CREATE INDEX "event_room_blocks_hotel_id_event_id_idx" ON "event_room_blocks"("hotel_id", "event_id");

-- CreateIndex
CREATE INDEX "event_timeline_entries_hotel_id_event_id_occurred_at_idx" ON "event_timeline_entries"("hotel_id", "event_id", "occurred_at");

-- CreateIndex
CREATE INDEX "cost_centers_hotel_id_idx" ON "cost_centers"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "cost_centers_hotel_id_code_key" ON "cost_centers"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "financial_years_hotel_id_is_current_idx" ON "financial_years"("hotel_id", "is_current");

-- CreateIndex
CREATE UNIQUE INDEX "financial_years_hotel_id_name_key" ON "financial_years"("hotel_id", "name");

-- CreateIndex
CREATE INDEX "fin_bank_accounts_hotel_id_idx" ON "fin_bank_accounts"("hotel_id");

-- CreateIndex
CREATE INDEX "fin_bank_transactions_hotel_id_bank_account_id_transaction__idx" ON "fin_bank_transactions"("hotel_id", "bank_account_id", "transaction_date" DESC);

-- CreateIndex
CREATE INDEX "fin_bank_reconciliations_hotel_id_bank_account_id_idx" ON "fin_bank_reconciliations"("hotel_id", "bank_account_id");

-- CreateIndex
CREATE INDEX "fin_cash_transactions_hotel_id_transaction_date_idx" ON "fin_cash_transactions"("hotel_id", "transaction_date" DESC);

-- CreateIndex
CREATE INDEX "fin_budgets_hotel_id_fiscal_year_idx" ON "fin_budgets"("hotel_id", "fiscal_year");

-- CreateIndex
CREATE INDEX "fin_receivables_hotel_id_status_idx" ON "fin_receivables"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "fin_receivables_hotel_id_due_date_idx" ON "fin_receivables"("hotel_id", "due_date");

-- CreateIndex
CREATE INDEX "fin_payables_hotel_id_status_idx" ON "fin_payables"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "fin_payables_hotel_id_due_date_idx" ON "fin_payables"("hotel_id", "due_date");

-- CreateIndex
CREATE INDEX "fin_gst_entries_hotel_id_period_year_period_month_idx" ON "fin_gst_entries"("hotel_id", "period_year", "period_month");

-- CreateIndex
CREATE INDEX "fin_approvals_hotel_id_entity_type_entity_id_idx" ON "fin_approvals"("hotel_id", "entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "accounts_hotel_id_type_idx" ON "accounts"("hotel_id", "type");

-- CreateIndex
CREATE INDEX "accounts_hotel_id_parent_id_idx" ON "accounts"("hotel_id", "parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_hotel_id_code_key" ON "accounts"("hotel_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "expense_categories_hotel_id_code_key" ON "expense_categories"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "expenses_hotel_id_status_idx" ON "expenses"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "expenses_hotel_id_expense_number_key" ON "expenses"("hotel_id", "expense_number");

-- CreateIndex
CREATE INDEX "incomes_hotel_id_type_idx" ON "incomes"("hotel_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "incomes_hotel_id_income_number_key" ON "incomes"("hotel_id", "income_number");

-- CreateIndex
CREATE INDEX "journal_entries_hotel_id_status_idx" ON "journal_entries"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "journal_entries_hotel_id_entry_date_idx" ON "journal_entries"("hotel_id", "entry_date");

-- CreateIndex
CREATE UNIQUE INDEX "journal_entries_hotel_id_entry_number_key" ON "journal_entries"("hotel_id", "entry_number");

-- CreateIndex
CREATE INDEX "journal_lines_hotel_id_entry_id_idx" ON "journal_lines"("hotel_id", "entry_id");

-- CreateIndex
CREATE INDEX "journal_lines_hotel_id_account_id_idx" ON "journal_lines"("hotel_id", "account_id");

-- CreateIndex
CREATE UNIQUE INDEX "salary_components_hotel_id_code_key" ON "salary_components"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "payroll_runs_hotel_id_status_idx" ON "payroll_runs"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_runs_hotel_id_run_number_key" ON "payroll_runs"("hotel_id", "run_number");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_lines_hotel_id_run_id_staff_id_key" ON "payroll_lines"("hotel_id", "run_id", "staff_id");

-- CreateIndex
CREATE INDEX "attendance_records_hotel_id_date_idx" ON "attendance_records"("hotel_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_records_hotel_id_staff_id_date_key" ON "attendance_records"("hotel_id", "staff_id", "date");

-- CreateIndex
CREATE INDEX "leave_requests_hotel_id_staff_id_idx" ON "leave_requests"("hotel_id", "staff_id");

-- CreateIndex
CREATE INDEX "leave_requests_hotel_id_status_idx" ON "leave_requests"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "shifts_hotel_id_name_key" ON "shifts"("hotel_id", "name");

-- CreateIndex
CREATE INDEX "staff_shifts_hotel_id_date_idx" ON "staff_shifts"("hotel_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "staff_shifts_hotel_id_staff_id_shift_id_date_key" ON "staff_shifts"("hotel_id", "staff_id", "shift_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_hotel_id_code_key" ON "restaurants"("hotel_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_tables_hotel_id_restaurant_id_table_number_key" ON "restaurant_tables"("hotel_id", "restaurant_id", "table_number");

-- CreateIndex
CREATE UNIQUE INDEX "menu_categories_hotel_id_restaurant_id_name_key" ON "menu_categories"("hotel_id", "restaurant_id", "name");

-- CreateIndex
CREATE INDEX "menu_items_hotel_id_category_id_idx" ON "menu_items"("hotel_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_hotel_id_restaurant_id_code_key" ON "menu_items"("hotel_id", "restaurant_id", "code");

-- CreateIndex
CREATE INDEX "kitchen_orders_hotel_id_status_idx" ON "kitchen_orders"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "kitchen_orders_hotel_id_order_number_key" ON "kitchen_orders"("hotel_id", "order_number");

-- CreateIndex
CREATE INDEX "kitchen_order_items_hotel_id_order_id_idx" ON "kitchen_order_items"("hotel_id", "order_id");

-- CreateIndex
CREATE INDEX "bills_hotel_id_status_idx" ON "bills"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "bills_hotel_id_guest_id_idx" ON "bills"("hotel_id", "guest_id");

-- CreateIndex
CREATE UNIQUE INDEX "bills_hotel_id_bill_number_key" ON "bills"("hotel_id", "bill_number");

-- CreateIndex
CREATE INDEX "bill_items_hotel_id_bill_id_idx" ON "bill_items"("hotel_id", "bill_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_bill_id_key" ON "invoices"("bill_id");

-- CreateIndex
CREATE INDEX "invoices_hotel_id_status_idx" ON "invoices"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "invoices_hotel_id_guest_id_idx" ON "invoices"("hotel_id", "guest_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_hotel_id_invoice_number_key" ON "invoices"("hotel_id", "invoice_number");

-- CreateIndex
CREATE INDEX "payments_hotel_id_status_idx" ON "payments"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "payments_hotel_id_guest_id_idx" ON "payments"("hotel_id", "guest_id");

-- CreateIndex
CREATE INDEX "payments_hotel_id_method_idx" ON "payments"("hotel_id", "method");

-- CreateIndex
CREATE UNIQUE INDEX "payments_hotel_id_payment_number_key" ON "payments"("hotel_id", "payment_number");

-- CreateIndex
CREATE UNIQUE INDEX "taxes_hotel_id_code_key" ON "taxes"("hotel_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_hotel_id_code_key" ON "discounts"("hotel_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_hotel_id_code_key" ON "coupons"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "loyalty_programs_hotel_id_idx" ON "loyalty_programs"("hotel_id");

-- CreateIndex
CREATE UNIQUE INDEX "loyalty_accounts_guest_id_key" ON "loyalty_accounts"("guest_id");

-- CreateIndex
CREATE INDEX "loyalty_accounts_hotel_id_tier_idx" ON "loyalty_accounts"("hotel_id", "tier");

-- CreateIndex
CREATE INDEX "loyalty_transactions_hotel_id_account_id_created_at_idx" ON "loyalty_transactions"("hotel_id", "account_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "key_cards_hotel_id_room_id_idx" ON "key_cards"("hotel_id", "room_id");

-- CreateIndex
CREATE INDEX "key_cards_hotel_id_status_idx" ON "key_cards"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "key_cards_hotel_id_card_number_key" ON "key_cards"("hotel_id", "card_number");

-- CreateIndex
CREATE INDEX "key_card_access_logs_hotel_id_key_card_id_created_at_idx" ON "key_card_access_logs"("hotel_id", "key_card_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "guest_requests_hotel_id_status_idx" ON "guest_requests"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "guest_requests_hotel_id_reservation_id_idx" ON "guest_requests"("hotel_id", "reservation_id");

-- CreateIndex
CREATE INDEX "front_desk_tasks_hotel_id_status_idx" ON "front_desk_tasks"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "front_desk_tasks_hotel_id_assigned_to_idx" ON "front_desk_tasks"("hotel_id", "assigned_to");

-- CreateIndex
CREATE INDEX "lost_and_found_items_hotel_id_status_idx" ON "lost_and_found_items"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "guest_communications_hotel_id_guest_id_idx" ON "guest_communications"("hotel_id", "guest_id");

-- CreateIndex
CREATE INDEX "guest_communications_hotel_id_status_idx" ON "guest_communications"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "front_desk_logs_hotel_id_created_at_idx" ON "front_desk_logs"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "front_desk_logs_hotel_id_action_idx" ON "front_desk_logs"("hotel_id", "action");

-- CreateIndex
CREATE UNIQUE INDEX "vip_guest_notes_hotel_id_guest_id_key" ON "vip_guest_notes"("hotel_id", "guest_id");

-- CreateIndex
CREATE UNIQUE INDEX "guest_portal_sessions_session_token_key" ON "guest_portal_sessions"("session_token");

-- CreateIndex
CREATE INDEX "guest_portal_sessions_hotel_id_reservation_id_idx" ON "guest_portal_sessions"("hotel_id", "reservation_id");

-- CreateIndex
CREATE INDEX "guest_portal_sessions_session_token_idx" ON "guest_portal_sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "room_qr_codes_hotel_id_room_id_key" ON "room_qr_codes"("hotel_id", "room_id");

-- CreateIndex
CREATE UNIQUE INDEX "room_qr_codes_token_key" ON "room_qr_codes"("token");

-- CreateIndex
CREATE INDEX "gxp_requests_hotel_id_status_idx" ON "gxp_requests"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "gxp_requests_hotel_id_reservation_id_idx" ON "gxp_requests"("hotel_id", "reservation_id");

-- CreateIndex
CREATE INDEX "gxp_requests_hotel_id_category_idx" ON "gxp_requests"("hotel_id", "category");

-- CreateIndex
CREATE INDEX "gxp_chat_messages_hotel_id_reservation_id_created_at_idx" ON "gxp_chat_messages"("hotel_id", "reservation_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "gxp_feedback_hotel_id_created_at_idx" ON "gxp_feedback"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "gxp_offers_hotel_id_is_active_idx" ON "gxp_offers"("hotel_id", "is_active");

-- CreateIndex
CREATE INDEX "gxp_announcements_hotel_id_is_active_idx" ON "gxp_announcements"("hotel_id", "is_active");

-- CreateIndex
CREATE INDEX "gxp_notifications_hotel_id_reservation_id_created_at_idx" ON "gxp_notifications"("hotel_id", "reservation_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "hotels_slug_key" ON "hotels"("slug");

-- CreateIndex
CREATE INDEX "hotels_status_is_active_idx" ON "hotels"("status", "is_active");

-- CreateIndex
CREATE INDEX "hotels_country_city_idx" ON "hotels"("country", "city");

-- CreateIndex
CREATE INDEX "hotels_deleted_at_idx" ON "hotels"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_subscriptions_hotel_id_key" ON "hotel_subscriptions"("hotel_id");

-- CreateIndex
CREATE INDEX "hotel_settings_hotel_id_module_idx" ON "hotel_settings"("hotel_id", "module");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_settings_hotel_id_scope_module_key_key" ON "hotel_settings"("hotel_id", "scope", "module", "key");

-- CreateIndex
CREATE INDEX "feature_flags_scope_is_enabled_idx" ON "feature_flags"("scope", "is_enabled");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_hotel_id_key_key" ON "feature_flags"("hotel_id", "key");

-- CreateIndex
CREATE INDEX "linen_inventory_hotel_id_category_idx" ON "linen_inventory"("hotel_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "linen_inventory_hotel_id_item_name_key" ON "linen_inventory"("hotel_id", "item_name");

-- CreateIndex
CREATE INDEX "amenity_refill_logs_hotel_id_room_id_idx" ON "amenity_refill_logs"("hotel_id", "room_id");

-- CreateIndex
CREATE INDEX "mini_bar_items_hotel_id_room_id_idx" ON "mini_bar_items"("hotel_id", "room_id");

-- CreateIndex
CREATE UNIQUE INDEX "mini_bar_items_hotel_id_room_id_item_name_key" ON "mini_bar_items"("hotel_id", "room_id", "item_name");

-- CreateIndex
CREATE INDEX "mini_bar_consumptions_hotel_id_room_id_idx" ON "mini_bar_consumptions"("hotel_id", "room_id");

-- CreateIndex
CREATE INDEX "housekeeping_inspections_hotel_id_task_id_idx" ON "housekeeping_inspections"("hotel_id", "task_id");

-- CreateIndex
CREATE INDEX "housekeeping_inspections_hotel_id_room_id_idx" ON "housekeeping_inspections"("hotel_id", "room_id");

-- CreateIndex
CREATE INDEX "deep_cleaning_schedules_hotel_id_next_due_date_idx" ON "deep_cleaning_schedules"("hotel_id", "next_due_date");

-- CreateIndex
CREATE INDEX "hr_departments_hotel_id_name_idx" ON "hr_departments"("hotel_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "hr_departments_hotel_id_code_key" ON "hr_departments"("hotel_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "hr_designations_hotel_id_name_key" ON "hr_designations"("hotel_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "staff_profiles_staff_id_key" ON "staff_profiles"("staff_id");

-- CreateIndex
CREATE INDEX "staff_profiles_hotel_id_idx" ON "staff_profiles"("hotel_id");

-- CreateIndex
CREATE INDEX "job_openings_hotel_id_status_idx" ON "job_openings"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "candidates_hotel_id_status_idx" ON "candidates"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "candidates_hotel_id_job_opening_id_idx" ON "candidates"("hotel_id", "job_opening_id");

-- CreateIndex
CREATE INDEX "interviews_hotel_id_scheduled_at_idx" ON "interviews"("hotel_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "onboarding_tasks_hotel_id_staff_id_idx" ON "onboarding_tasks"("hotel_id", "staff_id");

-- CreateIndex
CREATE INDEX "training_courses_hotel_id_category_idx" ON "training_courses"("hotel_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "employee_trainings_hotel_id_staff_id_course_id_key" ON "employee_trainings"("hotel_id", "staff_id", "course_id");

-- CreateIndex
CREATE INDEX "performance_reviews_hotel_id_staff_id_idx" ON "performance_reviews"("hotel_id", "staff_id");

-- CreateIndex
CREATE INDEX "hr_expense_claims_hotel_id_status_idx" ON "hr_expense_claims"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "hr_expense_claims_hotel_id_claim_number_key" ON "hr_expense_claims"("hotel_id", "claim_number");

-- CreateIndex
CREATE INDEX "exit_processes_hotel_id_status_idx" ON "exit_processes"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "users_is_active_is_super_admin_idx" ON "users"("is_active", "is_super_admin");

-- CreateIndex
CREATE INDEX "roles_hotel_id_is_active_idx" ON "roles"("hotel_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "roles_hotel_id_name_key" ON "roles"("hotel_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_hotel_id_code_key" ON "roles"("hotel_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE INDEX "permissions_module_resource_idx" ON "permissions"("module", "resource");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE INDEX "user_roles_hotel_id_user_id_idx" ON "user_roles"("hotel_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_hotel_id_key" ON "user_roles"("user_id", "role_id", "hotel_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_expires_at_idx" ON "refresh_tokens"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_hash_idx" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "oauth_accounts_user_id_idx" ON "oauth_accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_provider_provider_user_id_key" ON "oauth_accounts"("provider", "provider_user_id");

-- CreateIndex
CREATE INDEX "password_resets_token_hash_idx" ON "password_resets"("token_hash");

-- CreateIndex
CREATE INDEX "password_resets_user_id_expires_at_idx" ON "password_resets"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "login_history_user_id_created_at_idx" ON "login_history"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "login_history_hotel_id_created_at_idx" ON "login_history"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "ota_integrations_hotel_id_status_idx" ON "ota_integrations"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ota_integrations_hotel_id_provider_key" ON "ota_integrations"("hotel_id", "provider");

-- CreateIndex
CREATE INDEX "channel_mappings_hotel_id_room_type_id_idx" ON "channel_mappings"("hotel_id", "room_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "channel_mappings_hotel_id_integration_id_external_room_code_key" ON "channel_mappings"("hotel_id", "integration_id", "external_room_code");

-- CreateIndex
CREATE INDEX "dynamic_price_rules_hotel_id_room_type_id_idx" ON "dynamic_price_rules"("hotel_id", "room_type_id");

-- CreateIndex
CREATE INDEX "dynamic_price_rules_hotel_id_priority_idx" ON "dynamic_price_rules"("hotel_id", "priority");

-- CreateIndex
CREATE INDEX "ai_predictions_hotel_id_type_target_date_idx" ON "ai_predictions"("hotel_id", "type", "target_date");

-- CreateIndex
CREATE INDEX "ai_revenue_forecasts_hotel_id_forecast_date_idx" ON "ai_revenue_forecasts"("hotel_id", "forecast_date");

-- CreateIndex
CREATE UNIQUE INDEX "ai_revenue_forecasts_hotel_id_forecast_date_period_key" ON "ai_revenue_forecasts"("hotel_id", "forecast_date", "period");

-- CreateIndex
CREATE INDEX "ai_recommendation_logs_hotel_id_context_idx" ON "ai_recommendation_logs"("hotel_id", "context");

-- CreateIndex
CREATE INDEX "ai_recommendation_logs_hotel_id_created_at_idx" ON "ai_recommendation_logs"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "report_definitions_hotel_id_code_key" ON "report_definitions"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "report_runs_hotel_id_status_idx" ON "report_runs"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "report_runs_hotel_id_created_at_idx" ON "report_runs"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "dashboard_cache_hotel_id_expires_at_idx" ON "dashboard_cache"("hotel_id", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_cache_hotel_id_cache_key_key" ON "dashboard_cache"("hotel_id", "cache_key");

-- CreateIndex
CREATE INDEX "inventory_stores_hotel_id_store_type_idx" ON "inventory_stores"("hotel_id", "store_type");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_stores_hotel_id_code_key" ON "inventory_stores"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "stock_balances_hotel_id_store_id_idx" ON "stock_balances"("hotel_id", "store_id");

-- CreateIndex
CREATE INDEX "stock_balances_hotel_id_item_id_idx" ON "stock_balances"("hotel_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "stock_balances_store_id_item_id_key" ON "stock_balances"("store_id", "item_id");

-- CreateIndex
CREATE INDEX "stock_batches_hotel_id_expiry_date_idx" ON "stock_batches"("hotel_id", "expiry_date");

-- CreateIndex
CREATE INDEX "stock_batches_hotel_id_status_idx" ON "stock_batches"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "stock_batches_hotel_id_store_id_item_id_batch_number_key" ON "stock_batches"("hotel_id", "store_id", "item_id", "batch_number");

-- CreateIndex
CREATE INDEX "stock_transfers_hotel_id_status_idx" ON "stock_transfers"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "stock_transfers_hotel_id_transfer_number_key" ON "stock_transfers"("hotel_id", "transfer_number");

-- CreateIndex
CREATE INDEX "stock_transfer_items_transfer_id_idx" ON "stock_transfer_items"("transfer_id");

-- CreateIndex
CREATE INDEX "stock_issues_hotel_id_status_idx" ON "stock_issues"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "stock_issues_hotel_id_issue_number_key" ON "stock_issues"("hotel_id", "issue_number");

-- CreateIndex
CREATE INDEX "stock_issue_items_issue_id_idx" ON "stock_issue_items"("issue_id");

-- CreateIndex
CREATE INDEX "stock_consumptions_hotel_id_consumed_at_idx" ON "stock_consumptions"("hotel_id", "consumed_at" DESC);

-- CreateIndex
CREATE INDEX "stock_consumptions_hotel_id_department_idx" ON "stock_consumptions"("hotel_id", "department");

-- CreateIndex
CREATE INDEX "stock_adjustments_hotel_id_status_idx" ON "stock_adjustments"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "stock_adjustments_hotel_id_adjust_number_key" ON "stock_adjustments"("hotel_id", "adjust_number");

-- CreateIndex
CREATE INDEX "stock_audits_hotel_id_status_idx" ON "stock_audits"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "stock_audits_hotel_id_audit_number_key" ON "stock_audits"("hotel_id", "audit_number");

-- CreateIndex
CREATE INDEX "stock_audit_items_audit_id_idx" ON "stock_audit_items"("audit_id");

-- CreateIndex
CREATE INDEX "inventory_purchase_requests_hotel_id_status_idx" ON "inventory_purchase_requests"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_purchase_requests_hotel_id_request_number_key" ON "inventory_purchase_requests"("hotel_id", "request_number");

-- CreateIndex
CREATE INDEX "inventory_purchase_request_items_request_id_idx" ON "inventory_purchase_request_items"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "reorder_rules_hotel_id_item_id_key" ON "reorder_rules"("hotel_id", "item_id");

-- CreateIndex
CREATE INDEX "inventory_logs_hotel_id_entity_created_at_idx" ON "inventory_logs"("hotel_id", "entity", "created_at" DESC);

-- CreateIndex
CREATE INDEX "inventory_categories_hotel_id_parent_id_idx" ON "inventory_categories"("hotel_id", "parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_categories_hotel_id_code_key" ON "inventory_categories"("hotel_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "units_of_measure_hotel_id_symbol_key" ON "units_of_measure"("hotel_id", "symbol");

-- CreateIndex
CREATE INDEX "inventory_items_hotel_id_category_id_idx" ON "inventory_items"("hotel_id", "category_id");

-- CreateIndex
CREATE INDEX "inventory_items_hotel_id_barcode_idx" ON "inventory_items"("hotel_id", "barcode");

-- CreateIndex
CREATE INDEX "inventory_items_hotel_id_item_status_idx" ON "inventory_items"("hotel_id", "item_status");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_hotel_id_sku_key" ON "inventory_items"("hotel_id", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_hotel_id_code_key" ON "suppliers"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "vendors_hotel_id_vendor_status_idx" ON "vendors"("hotel_id", "vendor_status");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_hotel_id_code_key" ON "vendors"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "purchase_orders_hotel_id_status_idx" ON "purchase_orders"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "purchase_orders_hotel_id_vendor_id_idx" ON "purchase_orders"("hotel_id", "vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_hotel_id_po_number_key" ON "purchase_orders"("hotel_id", "po_number");

-- CreateIndex
CREATE INDEX "purchase_order_items_hotel_id_order_id_idx" ON "purchase_order_items"("hotel_id", "order_id");

-- CreateIndex
CREATE INDEX "goods_receipt_notes_hotel_id_status_idx" ON "goods_receipt_notes"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "goods_receipt_notes_hotel_id_grn_number_key" ON "goods_receipt_notes"("hotel_id", "grn_number");

-- CreateIndex
CREATE INDEX "grn_items_hotel_id_grn_id_idx" ON "grn_items"("hotel_id", "grn_id");

-- CreateIndex
CREATE INDEX "stock_movements_hotel_id_item_id_movement_date_idx" ON "stock_movements"("hotel_id", "item_id", "movement_date" DESC);

-- CreateIndex
CREATE INDEX "stock_movements_hotel_id_type_idx" ON "stock_movements"("hotel_id", "type");

-- CreateIndex
CREATE INDEX "stock_movements_hotel_id_store_id_idx" ON "stock_movements"("hotel_id", "store_id");

-- CreateIndex
CREATE INDEX "audit_logs_hotel_id_entity_type_entity_id_idx" ON "audit_logs"("hotel_id", "entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_hotel_id_created_at_idx" ON "audit_logs"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "activity_logs_hotel_id_created_at_idx" ON "activity_logs"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "activity_logs_user_id_created_at_idx" ON "activity_logs"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "api_logs_hotel_id_created_at_idx" ON "api_logs"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "api_logs_path_created_at_idx" ON "api_logs"("path", "created_at" DESC);

-- CreateIndex
CREATE INDEX "error_logs_hotel_id_severity_created_at_idx" ON "error_logs"("hotel_id", "severity", "created_at" DESC);

-- CreateIndex
CREATE INDEX "error_logs_error_code_idx" ON "error_logs"("error_code");

-- CreateIndex
CREATE INDEX "stored_files_hotel_id_category_idx" ON "stored_files"("hotel_id", "category");

-- CreateIndex
CREATE INDEX "stored_files_hotel_id_storage_key_idx" ON "stored_files"("hotel_id", "storage_key");

-- CreateIndex
CREATE INDEX "attachments_hotel_id_entity_type_entity_id_idx" ON "attachments"("hotel_id", "entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "encrypted_secrets_hotel_id_key_name_key" ON "encrypted_secrets"("hotel_id", "key_name");

-- CreateIndex
CREATE INDEX "housekeeping_tasks_hotel_id_status_idx" ON "housekeeping_tasks"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "housekeeping_tasks_hotel_id_room_id_idx" ON "housekeeping_tasks"("hotel_id", "room_id");

-- CreateIndex
CREATE INDEX "housekeeping_tasks_hotel_id_assigned_staff_id_idx" ON "housekeeping_tasks"("hotel_id", "assigned_staff_id");

-- CreateIndex
CREATE INDEX "cleaning_checklists_hotel_id_idx" ON "cleaning_checklists"("hotel_id");

-- CreateIndex
CREATE INDEX "cleaning_checklist_items_hotel_id_checklist_id_idx" ON "cleaning_checklist_items"("hotel_id", "checklist_id");

-- CreateIndex
CREATE INDEX "cleaning_checklist_items_hotel_id_task_id_idx" ON "cleaning_checklist_items"("hotel_id", "task_id");

-- CreateIndex
CREATE INDEX "laundry_orders_hotel_id_status_idx" ON "laundry_orders"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "laundry_orders_hotel_id_order_number_key" ON "laundry_orders"("hotel_id", "order_number");

-- CreateIndex
CREATE INDEX "laundry_items_hotel_id_order_id_idx" ON "laundry_items"("hotel_id", "order_id");

-- CreateIndex
CREATE INDEX "maintenance_requests_hotel_id_status_idx" ON "maintenance_requests"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "maintenance_requests_hotel_id_priority_idx" ON "maintenance_requests"("hotel_id", "priority");

-- CreateIndex
CREATE INDEX "maintenance_requests_hotel_id_room_id_idx" ON "maintenance_requests"("hotel_id", "room_id");

-- CreateIndex
CREATE UNIQUE INDEX "maintenance_requests_hotel_id_request_number_key" ON "maintenance_requests"("hotel_id", "request_number");

-- CreateIndex
CREATE UNIQUE INDEX "staff_user_id_key" ON "staff"("user_id");

-- CreateIndex
CREATE INDEX "staff_hotel_id_status_idx" ON "staff"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "staff_hotel_id_department_idx" ON "staff"("hotel_id", "department");

-- CreateIndex
CREATE UNIQUE INDEX "staff_hotel_id_employee_code_key" ON "staff"("hotel_id", "employee_code");

-- CreateIndex
CREATE INDEX "staff_documents_hotel_id_staff_id_idx" ON "staff_documents"("hotel_id", "staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "guests_user_id_key" ON "guests"("user_id");

-- CreateIndex
CREATE INDEX "guests_hotel_id_email_idx" ON "guests"("hotel_id", "email");

-- CreateIndex
CREATE INDEX "guests_hotel_id_phone_idx" ON "guests"("hotel_id", "phone");

-- CreateIndex
CREATE INDEX "guests_hotel_id_last_name_first_name_idx" ON "guests"("hotel_id", "last_name", "first_name");

-- CreateIndex
CREATE UNIQUE INDEX "guests_hotel_id_guest_code_key" ON "guests"("hotel_id", "guest_code");

-- CreateIndex
CREATE INDEX "guest_documents_hotel_id_guest_id_idx" ON "guest_documents"("hotel_id", "guest_id");

-- CreateIndex
CREATE INDEX "guest_documents_hotel_id_doc_type_idx" ON "guest_documents"("hotel_id", "doc_type");

-- CreateIndex
CREATE INDEX "travel_agents_hotel_id_name_idx" ON "travel_agents"("hotel_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "travel_agents_hotel_id_code_key" ON "travel_agents"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "group_bookings_hotel_id_check_in_date_check_out_date_idx" ON "group_bookings"("hotel_id", "check_in_date", "check_out_date");

-- CreateIndex
CREATE UNIQUE INDEX "group_bookings_hotel_id_group_code_key" ON "group_bookings"("hotel_id", "group_code");

-- CreateIndex
CREATE INDEX "room_blocks_hotel_id_room_id_start_date_end_date_idx" ON "room_blocks"("hotel_id", "room_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "room_blocks_hotel_id_reason_idx" ON "room_blocks"("hotel_id", "reason");

-- CreateIndex
CREATE INDEX "room_transfers_hotel_id_reservation_id_created_at_idx" ON "room_transfers"("hotel_id", "reservation_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "room_status_history_hotel_id_room_id_created_at_idx" ON "room_status_history"("hotel_id", "room_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "check_in_records_reservation_id_key" ON "check_in_records"("reservation_id");

-- CreateIndex
CREATE INDEX "check_in_records_hotel_id_guest_id_idx" ON "check_in_records"("hotel_id", "guest_id");

-- CreateIndex
CREATE UNIQUE INDEX "registration_cards_check_in_id_key" ON "registration_cards"("check_in_id");

-- CreateIndex
CREATE INDEX "registration_cards_hotel_id_guest_id_idx" ON "registration_cards"("hotel_id", "guest_id");

-- CreateIndex
CREATE UNIQUE INDEX "check_out_records_reservation_id_key" ON "check_out_records"("reservation_id");

-- CreateIndex
CREATE INDEX "check_out_records_hotel_id_guest_id_idx" ON "check_out_records"("hotel_id", "guest_id");

-- CreateIndex
CREATE INDEX "folio_charges_hotel_id_reservation_id_idx" ON "folio_charges"("hotel_id", "reservation_id");

-- CreateIndex
CREATE INDEX "folio_charges_hotel_id_category_idx" ON "folio_charges"("hotel_id", "category");

-- CreateIndex
CREATE INDEX "invoice_line_items_hotel_id_invoice_id_idx" ON "invoice_line_items"("hotel_id", "invoice_id");

-- CreateIndex
CREATE INDEX "night_audits_hotel_id_status_idx" ON "night_audits"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "night_audits_hotel_id_audit_date_key" ON "night_audits"("hotel_id", "audit_date");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_categories_hotel_id_code_key" ON "vendor_categories"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "vendor_contacts_vendor_id_idx" ON "vendor_contacts"("vendor_id");

-- CreateIndex
CREATE INDEX "proc_purchase_requests_hotel_id_status_idx" ON "proc_purchase_requests"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "proc_purchase_requests_hotel_id_request_number_key" ON "proc_purchase_requests"("hotel_id", "request_number");

-- CreateIndex
CREATE INDEX "proc_purchase_request_items_request_id_idx" ON "proc_purchase_request_items"("request_id");

-- CreateIndex
CREATE INDEX "rfqs_hotel_id_status_idx" ON "rfqs"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "rfqs_hotel_id_rfq_number_key" ON "rfqs"("hotel_id", "rfq_number");

-- CreateIndex
CREATE INDEX "rfq_items_rfq_id_idx" ON "rfq_items"("rfq_id");

-- CreateIndex
CREATE UNIQUE INDEX "rfq_vendors_rfq_id_vendor_id_key" ON "rfq_vendors"("rfq_id", "vendor_id");

-- CreateIndex
CREATE INDEX "vendor_quotations_hotel_id_rfq_id_idx" ON "vendor_quotations"("hotel_id", "rfq_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_quotations_hotel_id_quotation_number_key" ON "vendor_quotations"("hotel_id", "quotation_number");

-- CreateIndex
CREATE INDEX "quotation_items_quotation_id_idx" ON "quotation_items"("quotation_id");

-- CreateIndex
CREATE INDEX "purchase_returns_hotel_id_status_idx" ON "purchase_returns"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_returns_hotel_id_return_number_key" ON "purchase_returns"("hotel_id", "return_number");

-- CreateIndex
CREATE INDEX "purchase_return_items_return_id_idx" ON "purchase_return_items"("return_id");

-- CreateIndex
CREATE INDEX "vendor_contracts_hotel_id_end_date_idx" ON "vendor_contracts"("hotel_id", "end_date");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_contracts_hotel_id_contract_number_key" ON "vendor_contracts"("hotel_id", "contract_number");

-- CreateIndex
CREATE INDEX "vendor_ratings_hotel_id_vendor_id_idx" ON "vendor_ratings"("hotel_id", "vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "procurement_budgets_hotel_id_department_fiscal_year_key" ON "procurement_budgets"("hotel_id", "department", "fiscal_year");

-- CreateIndex
CREATE INDEX "procurement_approvals_hotel_id_entity_type_entity_id_idx" ON "procurement_approvals"("hotel_id", "entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "vendor_invoices_hotel_id_status_idx" ON "vendor_invoices"("hotel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_invoices_hotel_id_invoice_number_key" ON "vendor_invoices"("hotel_id", "invoice_number");

-- CreateIndex
CREATE INDEX "vendor_invoice_items_invoice_id_idx" ON "vendor_invoice_items"("invoice_id");

-- CreateIndex
CREATE INDEX "procurement_logs_hotel_id_entity_created_at_idx" ON "procurement_logs"("hotel_id", "entity", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "buildings_hotel_id_code_key" ON "buildings"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "floors_hotel_id_building_id_idx" ON "floors"("hotel_id", "building_id");

-- CreateIndex
CREATE UNIQUE INDEX "floors_hotel_id_building_id_floor_number_key" ON "floors"("hotel_id", "building_id", "floor_number");

-- CreateIndex
CREATE INDEX "room_types_hotel_id_is_active_idx" ON "room_types"("hotel_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "room_types_hotel_id_code_key" ON "room_types"("hotel_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "amenities_hotel_id_name_key" ON "amenities"("hotel_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "room_type_amenities_room_type_id_amenity_id_key" ON "room_type_amenities"("room_type_id", "amenity_id");

-- CreateIndex
CREATE INDEX "room_images_hotel_id_room_type_id_idx" ON "room_images"("hotel_id", "room_type_id");

-- CreateIndex
CREATE INDEX "rooms_hotel_id_status_idx" ON "rooms"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "rooms_hotel_id_room_type_id_idx" ON "rooms"("hotel_id", "room_type_id");

-- CreateIndex
CREATE INDEX "rooms_hotel_id_floor_id_idx" ON "rooms"("hotel_id", "floor_id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_hotel_id_room_number_key" ON "rooms"("hotel_id", "room_number");

-- CreateIndex
CREATE INDEX "assets_hotel_id_status_idx" ON "assets"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "assets_hotel_id_room_id_idx" ON "assets"("hotel_id", "room_id");

-- CreateIndex
CREATE INDEX "assets_hotel_id_category_id_idx" ON "assets"("hotel_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "assets_hotel_id_code_key" ON "assets"("hotel_id", "code");

-- CreateIndex
CREATE INDEX "reservations_hotel_id_group_booking_id_idx" ON "reservations"("hotel_id", "group_booking_id");

-- CreateIndex
CREATE INDEX "reservations_hotel_id_travel_agent_id_idx" ON "reservations"("hotel_id", "travel_agent_id");

-- CreateIndex
CREATE INDEX "reservations_hotel_id_status_idx" ON "reservations"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "reservations_hotel_id_check_in_date_check_out_date_idx" ON "reservations"("hotel_id", "check_in_date", "check_out_date");

-- CreateIndex
CREATE INDEX "reservations_hotel_id_guest_id_idx" ON "reservations"("hotel_id", "guest_id");

-- CreateIndex
CREATE INDEX "reservations_hotel_id_room_id_idx" ON "reservations"("hotel_id", "room_id");

-- CreateIndex
CREATE INDEX "reservations_hotel_id_source_idx" ON "reservations"("hotel_id", "source");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_hotel_id_reservation_code_key" ON "reservations"("hotel_id", "reservation_code");

-- CreateIndex
CREATE INDEX "reservation_history_hotel_id_reservation_id_created_at_idx" ON "reservation_history"("hotel_id", "reservation_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "menu_recipes_menu_item_id_key" ON "menu_recipes"("menu_item_id");

-- CreateIndex
CREATE INDEX "fnb_feedback_hotel_id_created_at_idx" ON "fnb_feedback"("hotel_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "waiter_tips_hotel_id_waiter_id_idx" ON "waiter_tips"("hotel_id", "waiter_id");

-- CreateIndex
CREATE INDEX "room_inspections_hotel_id_room_id_inspected_at_idx" ON "room_inspections"("hotel_id", "room_id", "inspected_at" DESC);

-- CreateIndex
CREATE INDEX "room_damages_hotel_id_room_id_idx" ON "room_damages"("hotel_id", "room_id");

-- CreateIndex
CREATE INDEX "room_damages_hotel_id_repair_status_idx" ON "room_damages"("hotel_id", "repair_status");

-- CreateIndex
CREATE INDEX "room_assets_hotel_id_room_id_idx" ON "room_assets"("hotel_id", "room_id");

-- CreateIndex
CREATE INDEX "drivers_hotel_id_is_on_duty_idx" ON "drivers"("hotel_id", "is_on_duty");

-- CreateIndex
CREATE UNIQUE INDEX "drivers_hotel_id_driver_code_key" ON "drivers"("hotel_id", "driver_code");

-- CreateIndex
CREATE INDEX "trips_hotel_id_status_idx" ON "trips"("hotel_id", "status");

-- CreateIndex
CREATE INDEX "trips_hotel_id_scheduled_at_idx" ON "trips"("hotel_id", "scheduled_at");

-- CreateIndex
CREATE UNIQUE INDEX "trips_hotel_id_trip_number_key" ON "trips"("hotel_id", "trip_number");

-- CreateIndex
CREATE INDEX "trip_stops_trip_id_idx" ON "trip_stops"("trip_id");

-- CreateIndex
CREATE UNIQUE INDEX "airport_transfer_details_trip_id_key" ON "airport_transfer_details"("trip_id");

-- CreateIndex
CREATE INDEX "travel_vendors_hotel_id_vendor_type_idx" ON "travel_vendors"("hotel_id", "vendor_type");

-- CreateIndex
CREATE INDEX "fuel_logs_hotel_id_vehicle_id_idx" ON "fuel_logs"("hotel_id", "vehicle_id");

-- CreateIndex
CREATE INDEX "vehicle_expenses_hotel_id_vehicle_id_idx" ON "vehicle_expenses"("hotel_id", "vehicle_id");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_logs_hotel_id_vehicle_id_idx" ON "vehicle_maintenance_logs"("hotel_id", "vehicle_id");

-- CreateIndex
CREATE INDEX "gps_logs_hotel_id_trip_id_idx" ON "gps_logs"("hotel_id", "trip_id");

-- CreateIndex
CREATE INDEX "gps_logs_hotel_id_vehicle_id_recorded_at_idx" ON "gps_logs"("hotel_id", "vehicle_id", "recorded_at");

-- CreateIndex
CREATE INDEX "trip_payments_hotel_id_trip_id_idx" ON "trip_payments"("hotel_id", "trip_id");

-- CreateIndex
CREATE INDEX "driver_attendance_hotel_id_driver_id_shift_date_idx" ON "driver_attendance"("hotel_id", "driver_id", "shift_date");

-- CreateIndex
CREATE INDEX "shuttle_routes_hotel_id_idx" ON "shuttle_routes"("hotel_id");

-- CreateIndex
CREATE INDEX "shuttle_schedules_hotel_id_route_id_idx" ON "shuttle_schedules"("hotel_id", "route_id");

-- AddForeignKey
ALTER TABLE "otp_verifications" ADD CONSTRAINT "otp_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trusted_devices" ADD CONSTRAINT "trusted_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_history" ADD CONSTRAINT "password_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_plans" ADD CONSTRAINT "rate_plans_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_plans" ADD CONSTRAINT "rate_plans_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_addons" ADD CONSTRAINT "booking_addons_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_addon_selections" ADD CONSTRAINT "booking_addon_selections_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_addon_selections" ADD CONSTRAINT "booking_addon_selections_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_addon_selections" ADD CONSTRAINT "booking_addon_selections_addon_id_fkey" FOREIGN KEY ("addon_id") REFERENCES "booking_addons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_holds" ADD CONSTRAINT "inventory_holds_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_holds" ADD CONSTRAINT "inventory_holds_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_events" ADD CONSTRAINT "booking_events_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_events" ADD CONSTRAINT "booking_events_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_rate_plan_mappings" ADD CONSTRAINT "channel_rate_plan_mappings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_rate_plan_mappings" ADD CONSTRAINT "channel_rate_plan_mappings_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "ota_integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_rate_plan_mappings" ADD CONSTRAINT "channel_rate_plan_mappings_rate_plan_id_fkey" FOREIGN KEY ("rate_plan_id") REFERENCES "rate_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_restrictions" ADD CONSTRAINT "channel_restrictions_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_restrictions" ADD CONSTRAINT "channel_restrictions_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "ota_integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_restrictions" ADD CONSTRAINT "channel_restrictions_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_sync_logs" ADD CONSTRAINT "channel_sync_logs_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_sync_logs" ADD CONSTRAINT "channel_sync_logs_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "ota_integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_sync_logs" ADD CONSTRAINT "channel_sync_logs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "channel_sync_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_webhook_events" ADD CONSTRAINT "channel_webhook_events_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_webhook_events" ADD CONSTRAINT "channel_webhook_events_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "ota_integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_webhook_events" ADD CONSTRAINT "channel_webhook_events_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_commission_logs" ADD CONSTRAINT "channel_commission_logs_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_commission_logs" ADD CONSTRAINT "channel_commission_logs_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "ota_integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_commission_logs" ADD CONSTRAINT "channel_commission_logs_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_sync_jobs" ADD CONSTRAINT "channel_sync_jobs_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_sync_jobs" ADD CONSTRAINT "channel_sync_jobs_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "ota_integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_pages" ADD CONSTRAINT "cms_pages_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_sections" ADD CONSTRAINT "cms_sections_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_sections" ADD CONSTRAINT "cms_sections_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "cms_pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_hero_slides" ADD CONSTRAINT "cms_hero_slides_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_website_rooms" ADD CONSTRAINT "cms_website_rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_website_rooms" ADD CONSTRAINT "cms_website_rooms_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_offers" ADD CONSTRAINT "cms_offers_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_gallery_items" ADD CONSTRAINT "cms_gallery_items_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_gallery_items" ADD CONSTRAINT "cms_gallery_items_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "cms_media_albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_testimonials" ADD CONSTRAINT "cms_testimonials_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_media_folders" ADD CONSTRAINT "cms_media_folders_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_media_folders" ADD CONSTRAINT "cms_media_folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "cms_media_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_media_albums" ADD CONSTRAINT "cms_media_albums_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_media_files" ADD CONSTRAINT "cms_media_files_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_media_files" ADD CONSTRAINT "cms_media_files_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "cms_media_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_seo" ADD CONSTRAINT "cms_seo_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_seo" ADD CONSTRAINT "cms_seo_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "cms_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_seo" ADD CONSTRAINT "cms_seo_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "cms_website_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_seo" ADD CONSTRAINT "cms_seo_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "cms_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_menus" ADD CONSTRAINT "cms_menus_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_forms" ADD CONSTRAINT "cms_forms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_form_submissions" ADD CONSTRAINT "cms_form_submissions_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_form_submissions" ADD CONSTRAINT "cms_form_submissions_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "cms_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_newsletter_subscribers" ADD CONSTRAINT "cms_newsletter_subscribers_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_blog_posts" ADD CONSTRAINT "cms_blog_posts_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_blog_posts" ADD CONSTRAINT "cms_blog_posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "cms_blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_blog_categories" ADD CONSTRAINT "cms_blog_categories_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_revisions" ADD CONSTRAINT "cms_revisions_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_revisions" ADD CONSTRAINT "cms_revisions_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "cms_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_website_settings" ADD CONSTRAINT "cms_website_settings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_sales_leads" ADD CONSTRAINT "corp_sales_leads_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_company_contacts" ADD CONSTRAINT "corp_company_contacts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_account_teams" ADD CONSTRAINT "corp_account_teams_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_sales_meetings" ADD CONSTRAINT "corp_sales_meetings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_sales_activities" ADD CONSTRAINT "corp_sales_activities_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_rate_plans" ADD CONSTRAINT "corp_rate_plans_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_room_allocations" ADD CONSTRAINT "corp_room_allocations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_sales_tasks" ADD CONSTRAINT "corp_sales_tasks_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_sales_documents" ADD CONSTRAINT "corp_sales_documents_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_credit_accounts" ADD CONSTRAINT "corp_credit_accounts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_billing_invoices" ADD CONSTRAINT "corp_billing_invoices_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_billing_payments" ADD CONSTRAINT "corp_billing_payments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_contract_renewals" ADD CONSTRAINT "corp_contract_renewals_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_contract_renewals" ADD CONSTRAINT "corp_contract_renewals_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "corporate_contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_sales_commissions" ADD CONSTRAINT "corp_sales_commissions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corp_approval_requests" ADD CONSTRAINT "corp_approval_requests_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_companies" ADD CONSTRAINT "corporate_companies_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_contracts" ADD CONSTRAINT "corporate_contracts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_employees" ADD CONSTRAINT "corporate_employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_employees" ADD CONSTRAINT "corporate_employees_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "corporate_bookings" ADD CONSTRAINT "corporate_bookings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "corporate_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "event_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "banquet_halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banquet_bookings" ADD CONSTRAINT "banquet_bookings_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banquet_bookings" ADD CONSTRAINT "banquet_bookings_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "banquet_halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "travel_vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airport_pickups" ADD CONSTRAINT "airport_pickups_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airport_pickups" ADD CONSTRAINT "airport_pickups_travel_request_id_fkey" FOREIGN KEY ("travel_request_id") REFERENCES "travel_desk_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airport_pickups" ADD CONSTRAINT "airport_pickups_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_records" ADD CONSTRAINT "parking_records_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "parking_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_timeline_events" ADD CONSTRAINT "guest_timeline_events_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_crm_notes" ADD CONSTRAINT "guest_crm_notes_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_guest_id_fkey" FOREIGN KEY ("referrer_guest_id") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crm_activities" ADD CONSTRAINT "crm_activities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "crm_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_categories" ADD CONSTRAINT "asset_categories_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_maintenance_request_id_fkey" FOREIGN KEY ("maintenance_request_id") REFERENCES "maintenance_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_assigned_staff_id_fkey" FOREIGN KEY ("assigned_staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_pm_plan_id_fkey" FOREIGN KEY ("pm_plan_id") REFERENCES "preventive_maintenance_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_parts" ADD CONSTRAINT "work_order_parts_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_order_parts" ADD CONSTRAINT "work_order_parts_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventive_maintenance_plans" ADD CONSTRAINT "preventive_maintenance_plans_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_amc_contracts" ADD CONSTRAINT "asset_amc_contracts_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_warranty_claims" ADD CONSTRAINT "asset_warranty_claims_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_inspections" ADD CONSTRAINT "maintenance_inspections_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_inspections" ADD CONSTRAINT "maintenance_inspections_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technician_profiles" ADD CONSTRAINT "technician_profiles_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_history" ADD CONSTRAINT "asset_history_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_documents" ADD CONSTRAINT "asset_documents_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "energy_readings" ADD CONSTRAINT "energy_readings_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_inspection_records" ADD CONSTRAINT "safety_inspection_records_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hall_availability" ADD CONSTRAINT "hall_availability_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "banquet_halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hall_availability" ADD CONSTRAINT "hall_availability_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_leads" ADD CONSTRAINT "event_leads_preferred_hall_id_fkey" FOREIGN KEY ("preferred_hall_id") REFERENCES "banquet_halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_leads" ADD CONSTRAINT "event_leads_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_clients" ADD CONSTRAINT "event_clients_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_clients" ADD CONSTRAINT "event_clients_preferred_hall_id_fkey" FOREIGN KEY ("preferred_hall_id") REFERENCES "banquet_halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_quotations" ADD CONSTRAINT "event_quotations_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "event_leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_quotations" ADD CONSTRAINT "event_quotations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "event_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_quotations" ADD CONSTRAINT "event_quotations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_quotations" ADD CONSTRAINT "event_quotations_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "banquet_halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_quotation_lines" ADD CONSTRAINT "event_quotation_lines_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "event_quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_menus" ADD CONSTRAINT "event_menus_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_menu_items" ADD CONSTRAINT "event_menu_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "event_menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_tasks" ADD CONSTRAINT "event_tasks_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_resource_allocations" ADD CONSTRAINT "event_resource_allocations_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "event_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_resource_allocations" ADD CONSTRAINT "event_resource_allocations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_contracts" ADD CONSTRAINT "event_contracts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_contracts" ADD CONSTRAINT "event_contracts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "event_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_payments" ADD CONSTRAINT "event_payments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_payments" ADD CONSTRAINT "event_payments_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "event_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_seating_plans" ADD CONSTRAINT "event_seating_plans_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_checklists" ADD CONSTRAINT "event_checklists_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_checklist_items" ADD CONSTRAINT "event_checklist_items_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "event_checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_room_blocks" ADD CONSTRAINT "event_room_blocks_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_room_blocks" ADD CONSTRAINT "event_room_blocks_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_timeline_entries" ADD CONSTRAINT "event_timeline_entries_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_centers" ADD CONSTRAINT "cost_centers_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_bank_accounts" ADD CONSTRAINT "fin_bank_accounts_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_bank_accounts" ADD CONSTRAINT "fin_bank_accounts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_bank_transactions" ADD CONSTRAINT "fin_bank_transactions_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "fin_bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_bank_transactions" ADD CONSTRAINT "fin_bank_transactions_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_bank_reconciliations" ADD CONSTRAINT "fin_bank_reconciliations_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "fin_bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_cash_transactions" ADD CONSTRAINT "fin_cash_transactions_journal_entry_id_fkey" FOREIGN KEY ("journal_entry_id") REFERENCES "journal_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_budgets" ADD CONSTRAINT "fin_budgets_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fin_budgets" ADD CONSTRAINT "fin_budgets_cost_center_id_fkey" FOREIGN KEY ("cost_center_id") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_cost_center_id_fkey" FOREIGN KEY ("cost_center_id") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "expense_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_cost_center_id_fkey" FOREIGN KEY ("cost_center_id") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incomes" ADD CONSTRAINT "incomes_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_cost_center_id_fkey" FOREIGN KEY ("cost_center_id") REFERENCES "cost_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_financial_year_id_fkey" FOREIGN KEY ("financial_year_id") REFERENCES "financial_years"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_lines" ADD CONSTRAINT "payroll_lines_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "payroll_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_lines" ADD CONSTRAINT "payroll_lines_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_shifts" ADD CONSTRAINT "staff_shifts_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_shifts" ADD CONSTRAINT "staff_shifts_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_tables" ADD CONSTRAINT "restaurant_tables_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "menu_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kitchen_orders" ADD CONSTRAINT "kitchen_orders_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kitchen_order_items" ADD CONSTRAINT "kitchen_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "kitchen_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kitchen_order_items" ADD CONSTRAINT "kitchen_order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "restaurant_tables"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_items" ADD CONSTRAINT "bill_items_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_items" ADD CONSTRAINT "bill_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taxes" ADD CONSTRAINT "taxes_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_accounts" ADD CONSTRAINT "loyalty_accounts_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_accounts" ADD CONSTRAINT "loyalty_accounts_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "loyalty_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loyalty_transactions" ADD CONSTRAINT "loyalty_transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "loyalty_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key_card_access_logs" ADD CONSTRAINT "key_card_access_logs_key_card_id_fkey" FOREIGN KEY ("key_card_id") REFERENCES "key_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_requests" ADD CONSTRAINT "guest_requests_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "front_desk_tasks" ADD CONSTRAINT "front_desk_tasks_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lost_and_found_items" ADD CONSTRAINT "lost_and_found_items_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_communications" ADD CONSTRAINT "guest_communications_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vip_guest_notes" ADD CONSTRAINT "vip_guest_notes_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_portal_sessions" ADD CONSTRAINT "guest_portal_sessions_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_qr_codes" ADD CONSTRAINT "room_qr_codes_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gxp_requests" ADD CONSTRAINT "gxp_requests_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gxp_chat_messages" ADD CONSTRAINT "gxp_chat_messages_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gxp_feedback" ADD CONSTRAINT "gxp_feedback_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gxp_offers" ADD CONSTRAINT "gxp_offers_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gxp_announcements" ADD CONSTRAINT "gxp_announcements_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gxp_notifications" ADD CONSTRAINT "gxp_notifications_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_subscriptions" ADD CONSTRAINT "hotel_subscriptions_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_settings" ADD CONSTRAINT "hotel_settings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mini_bar_consumptions" ADD CONSTRAINT "mini_bar_consumptions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "mini_bar_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_departments" ADD CONSTRAINT "hr_departments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "hr_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_designations" ADD CONSTRAINT "hr_designations_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "hr_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_openings" ADD CONSTRAINT "job_openings_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "hr_departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_openings" ADD CONSTRAINT "job_openings_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "hr_designations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_job_opening_id_fkey" FOREIGN KEY ("job_opening_id") REFERENCES "job_openings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_tasks" ADD CONSTRAINT "onboarding_tasks_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_trainings" ADD CONSTRAINT "employee_trainings_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_trainings" ADD CONSTRAINT "employee_trainings_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "training_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_reviews" ADD CONSTRAINT "performance_reviews_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_expense_claims" ADD CONSTRAINT "hr_expense_claims_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exit_processes" ADD CONSTRAINT "exit_processes_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ota_integrations" ADD CONSTRAINT "ota_integrations_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_mappings" ADD CONSTRAINT "channel_mappings_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "ota_integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_mappings" ADD CONSTRAINT "channel_mappings_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dynamic_price_rules" ADD CONSTRAINT "dynamic_price_rules_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_runs" ADD CONSTRAINT "report_runs_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "report_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stores" ADD CONSTRAINT "inventory_stores_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_stores" ADD CONSTRAINT "inventory_stores_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "inventory_stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_batches" ADD CONSTRAINT "stock_batches_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "inventory_stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_batches" ADD CONSTRAINT "stock_batches_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_from_store_id_fkey" FOREIGN KEY ("from_store_id") REFERENCES "inventory_stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_to_store_id_fkey" FOREIGN KEY ("to_store_id") REFERENCES "inventory_stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "stock_transfers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_issues" ADD CONSTRAINT "stock_issues_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "inventory_stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_issue_items" ADD CONSTRAINT "stock_issue_items_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "stock_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_issue_items" ADD CONSTRAINT "stock_issue_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_consumptions" ADD CONSTRAINT "stock_consumptions_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "inventory_stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_consumptions" ADD CONSTRAINT "stock_consumptions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "inventory_stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_audits" ADD CONSTRAINT "stock_audits_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "inventory_stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_audit_items" ADD CONSTRAINT "stock_audit_items_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "stock_audits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_audit_items" ADD CONSTRAINT "stock_audit_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_purchase_requests" ADD CONSTRAINT "inventory_purchase_requests_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_purchase_request_items" ADD CONSTRAINT "inventory_purchase_request_items_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "inventory_purchase_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_purchase_request_items" ADD CONSTRAINT "inventory_purchase_request_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reorder_rules" ADD CONSTRAINT "reorder_rules_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_logs" ADD CONSTRAINT "inventory_logs_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_categories" ADD CONSTRAINT "inventory_categories_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_categories" ADD CONSTRAINT "inventory_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "inventory_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "inventory_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "inventory_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units_of_measure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_purchase_unit_id_fkey" FOREIGN KEY ("purchase_unit_id") REFERENCES "units_of_measure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_consumption_unit_id_fkey" FOREIGN KEY ("consumption_unit_id") REFERENCES "units_of_measure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_default_store_id_fkey" FOREIGN KEY ("default_store_id") REFERENCES "inventory_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "vendor_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipt_notes" ADD CONSTRAINT "goods_receipt_notes_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipt_notes" ADD CONSTRAINT "goods_receipt_notes_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipt_notes" ADD CONSTRAINT "goods_receipt_notes_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "inventory_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipt_notes" ADD CONSTRAINT "goods_receipt_notes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_items" ADD CONSTRAINT "grn_items_grn_id_fkey" FOREIGN KEY ("grn_id") REFERENCES "goods_receipt_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_items" ADD CONSTRAINT "grn_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stored_files" ADD CONSTRAINT "stored_files_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "stored_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housekeeping_tasks" ADD CONSTRAINT "housekeeping_tasks_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housekeeping_tasks" ADD CONSTRAINT "housekeeping_tasks_assigned_staff_id_fkey" FOREIGN KEY ("assigned_staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cleaning_checklist_items" ADD CONSTRAINT "cleaning_checklist_items_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "cleaning_checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cleaning_checklist_items" ADD CONSTRAINT "cleaning_checklist_items_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "housekeeping_tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laundry_orders" ADD CONSTRAINT "laundry_orders_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laundry_items" ADD CONSTRAINT "laundry_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "laundry_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_assigned_staff_id_fkey" FOREIGN KEY ("assigned_staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_documents" ADD CONSTRAINT "staff_documents_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_documents" ADD CONSTRAINT "staff_documents_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "stored_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_documents" ADD CONSTRAINT "guest_documents_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_documents" ADD CONSTRAINT "guest_documents_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "stored_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_agents" ADD CONSTRAINT "travel_agents_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_bookings" ADD CONSTRAINT "group_bookings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_blocks" ADD CONSTRAINT "room_blocks_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_transfers" ADD CONSTRAINT "room_transfers_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_transfers" ADD CONSTRAINT "room_transfers_from_room_id_fkey" FOREIGN KEY ("from_room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_transfers" ADD CONSTRAINT "room_transfers_to_room_id_fkey" FOREIGN KEY ("to_room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_status_history" ADD CONSTRAINT "room_status_history_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_in_records" ADD CONSTRAINT "check_in_records_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_in_records" ADD CONSTRAINT "check_in_records_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_cards" ADD CONSTRAINT "registration_cards_check_in_id_fkey" FOREIGN KEY ("check_in_id") REFERENCES "check_in_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_out_records" ADD CONSTRAINT "check_out_records_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folio_charges" ADD CONSTRAINT "folio_charges_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folio_charges" ADD CONSTRAINT "folio_charges_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_line_items" ADD CONSTRAINT "invoice_line_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "night_audits" ADD CONSTRAINT "night_audits_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_categories" ADD CONSTRAINT "vendor_categories_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_contacts" ADD CONSTRAINT "vendor_contacts_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proc_purchase_requests" ADD CONSTRAINT "proc_purchase_requests_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proc_purchase_request_items" ADD CONSTRAINT "proc_purchase_request_items_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "proc_purchase_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proc_purchase_request_items" ADD CONSTRAINT "proc_purchase_request_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_purchase_request_id_fkey" FOREIGN KEY ("purchase_request_id") REFERENCES "proc_purchase_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_items" ADD CONSTRAINT "rfq_items_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_items" ADD CONSTRAINT "rfq_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_vendors" ADD CONSTRAINT "rfq_vendors_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfq_vendors" ADD CONSTRAINT "rfq_vendors_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_quotations" ADD CONSTRAINT "vendor_quotations_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_quotations" ADD CONSTRAINT "vendor_quotations_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_quotations" ADD CONSTRAINT "vendor_quotations_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "vendor_quotations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_returns" ADD CONSTRAINT "purchase_returns_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_return_items" ADD CONSTRAINT "purchase_return_items_return_id_fkey" FOREIGN KEY ("return_id") REFERENCES "purchase_returns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_return_items" ADD CONSTRAINT "purchase_return_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_contracts" ADD CONSTRAINT "vendor_contracts_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_contracts" ADD CONSTRAINT "vendor_contracts_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_ratings" ADD CONSTRAINT "vendor_ratings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_ratings" ADD CONSTRAINT "vendor_ratings_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_budgets" ADD CONSTRAINT "procurement_budgets_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_approvals" ADD CONSTRAINT "procurement_approvals_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invoices" ADD CONSTRAINT "vendor_invoices_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invoices" ADD CONSTRAINT "vendor_invoices_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invoices" ADD CONSTRAINT "vendor_invoices_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_invoice_items" ADD CONSTRAINT "vendor_invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "vendor_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procurement_logs" ADD CONSTRAINT "procurement_logs_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floors" ADD CONSTRAINT "floors_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_types" ADD CONSTRAINT "room_types_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_type_amenities" ADD CONSTRAINT "room_type_amenities_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_type_amenities" ADD CONSTRAINT "room_type_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_images" ADD CONSTRAINT "room_images_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_images" ADD CONSTRAINT "room_images_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "stored_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "floors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "asset_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_corporate_booking_id_fkey" FOREIGN KEY ("corporate_booking_id") REFERENCES "corporate_bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_group_booking_id_fkey" FOREIGN KEY ("group_booking_id") REFERENCES "group_bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_travel_agent_id_fkey" FOREIGN KEY ("travel_agent_id") REFERENCES "travel_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_history" ADD CONSTRAINT "reservation_history_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_recipes" ADD CONSTRAINT "menu_recipes_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_inspections" ADD CONSTRAINT "room_inspections_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_damages" ADD CONSTRAINT "room_damages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_assets" ADD CONSTRAINT "room_assets_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_travel_request_id_fkey" FOREIGN KEY ("travel_request_id") REFERENCES "travel_desk_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airport_transfer_details" ADD CONSTRAINT "airport_transfer_details_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_expenses" ADD CONSTRAINT "vehicle_expenses_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_maintenance_logs" ADD CONSTRAINT "vehicle_maintenance_logs_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gps_logs" ADD CONSTRAINT "gps_logs_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gps_logs" ADD CONSTRAINT "gps_logs_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gps_logs" ADD CONSTRAINT "gps_logs_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_payments" ADD CONSTRAINT "trip_payments_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_attendance" ADD CONSTRAINT "driver_attendance_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shuttle_schedules" ADD CONSTRAINT "shuttle_schedules_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "shuttle_routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
