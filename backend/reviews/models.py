from django.db import models

class Platform(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True, null=False)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'platforms'


class RestaurantType(models.Model):
    id = models.AutoField(primary_key=True)
    type_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.type_name

    class Meta:
        db_table = 'restaurant_types'


class Restaurant(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    road_address = models.CharField(max_length=255, null=True, blank=True)
    common_address = models.CharField(max_length=255, null=True, blank=True)
    jibun_address = models.CharField(max_length=255, null=True, blank=True)
    zip_code = models.CharField(max_length=50, null=True, blank=True)
    main_image_url = models.CharField(max_length=255, null=True, blank=True)
    type = models.ForeignKey(
        RestaurantType,
        on_delete=models.SET_NULL,
        null=True,
        db_column='type_id'
    )
    average_rating = models.FloatField(null=True, blank=True)
    is_active = models.BooleanField(default=True)  # 리뷰 서비스를 제공하는 음식점 여부
    last_checked_at = models.DateTimeField(null=True, blank=True)
    summary_date = models.DateField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'restaurants'


class RestaurantPlatformInfo(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        db_column='restaurant_id'
    )
    platform = models.ForeignKey(
        Platform,
        on_delete=models.CASCADE,
        db_column='platform_id'
    )
    description = models.TextField(null=True, blank=True)
    identifier = models.CharField(max_length=255)
    last_updated = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'restaurant_platform_info'
        unique_together = (('restaurant', 'platform'),)


class RestaurantPlatformSummary(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        db_column='restaurant_id'
    )
    platform = models.ForeignKey(
        Platform,
        on_delete=models.CASCADE,
        db_column='platform_id'
    )
    positive_summary = models.TextField(null=True, blank=True)
    negative_summary = models.TextField(null=True, blank=True)
    neutral_summary = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'restaurant_platform_summaries'
        unique_together = (('restaurant', 'platform'),)


class RestaurantPlatformRating(models.Model):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        db_column='restaurant_id'
    )
    platform = models.ForeignKey(
        Platform,
        on_delete=models.CASCADE,
        db_column='platform_id'
    )
    rating_date = models.DateField()
    rating = models.FloatField(null=True, blank=True)
    review_count = models.IntegerField(null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'restaurant_platform_ratings'
        unique_together = (('restaurant', 'platform', 'rating_date'),)


class Sentiment(models.Model):
    code = models.IntegerField(primary_key=True)
    sentiment_type = models.CharField(max_length=255, unique=True, null=False)

    def __str__(self):
        return self.sentiment_type

    class Meta:
        db_table = 'sentiments'


class ReviewAuthor(models.Model):
    id = models.AutoField(primary_key=True)
    author_platform_id = models.CharField(max_length=255)
    nickname = models.CharField(max_length=255, null=True, blank=True)
    platform = models.ForeignKey(
        Platform,
        on_delete=models.CASCADE,
        db_column='platform_id'
    )
    average_rating = models.FloatField(null=True, blank=True)
    review_count = models.IntegerField(null=True, blank=True)
    author_score = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'review_authors'
        unique_together = (('author_platform_id', 'platform'),)


class Review(models.Model):
    id = models.AutoField(primary_key=True)
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        db_column='restaurant_id'
    )
    author = models.ForeignKey(
        ReviewAuthor,
        on_delete=models.SET_NULL,
        null=True,
        db_column='author_id'
    )
    content = models.TextField()
    selected_menu = models.CharField(max_length=255, null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    has_reply = models.BooleanField(default=False)
    has_image = models.BooleanField(default=False)
    likes_count = models.IntegerField(null=True, blank=True)

    # 수동 라벨링 필드
    manual_true_label_attempted = models.BooleanField(default=False)
    manual_sentiment_label_attempted = models.BooleanField(default=False)
    manual_is_true_review = models.BooleanField(null=True, blank=True)
    manual_sentiment = models.ForeignKey(
        Sentiment,
        on_delete=models.SET_NULL,
        null=True,
        related_name='manual_sentiment_reviews',
        db_column='manual_sentiment'
    )

    # AI 분석 결과 필드
    ai_is_true_review = models.BooleanField(null=True, blank=True)
    ai_sentiment = models.ForeignKey(
        Sentiment,
        on_delete=models.SET_NULL,
        null=True,
        related_name='ai_sentiment_reviews',
        db_column='ai_sentiment'
    )
    analysis_performed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'reviews'


class RestaurantPlatformAnalysis(models.Model):
    id = models.AutoField(primary_key=True)
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        db_column='restaurant_id'
    )
    analysis_date = models.DateField()
    platform = models.ForeignKey(
        Platform,
        on_delete=models.CASCADE,
        db_column='platform_id',
        null=False
    )
    ai_review_score = models.FloatField(null=True, blank=True)
    prediction_accuracy = models.FloatField(null=True, blank=True)
    positive_review_ratio = models.FloatField(null=True, blank=True)
    negative_review_ratio = models.FloatField(null=True, blank=True)
    neutral_review_ratio = models.FloatField(null=True, blank=True)
    true_review_ratio = models.FloatField(null=True, blank=True)
    fake_review_ratio = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'restaurant_platform_analysis'
        unique_together = (('restaurant', 'analysis_date', 'platform'),)
