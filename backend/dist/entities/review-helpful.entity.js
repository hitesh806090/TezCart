"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewHelpfulVote = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const review_entity_1 = require("./review.entity");
let ReviewHelpfulVote = class ReviewHelpfulVote {
    id;
    user;
    userId;
    review;
    reviewId;
    isHelpful;
    createdAt;
};
exports.ReviewHelpfulVote = ReviewHelpfulVote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReviewHelpfulVote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], ReviewHelpfulVote.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReviewHelpfulVote.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => review_entity_1.Review, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'reviewId' }),
    __metadata("design:type", review_entity_1.Review)
], ReviewHelpfulVote.prototype, "review", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReviewHelpfulVote.prototype, "reviewId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], ReviewHelpfulVote.prototype, "isHelpful", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReviewHelpfulVote.prototype, "createdAt", void 0);
exports.ReviewHelpfulVote = ReviewHelpfulVote = __decorate([
    (0, typeorm_1.Entity)('review_helpful_votes'),
    (0, typeorm_1.Index)(['userId', 'reviewId'], { unique: true })
], ReviewHelpfulVote);
//# sourceMappingURL=review-helpful.entity.js.map