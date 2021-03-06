package rs.ac.uns.ftn.ktsnvt.kultura.dto;

import lombok.*;
import rs.ac.uns.ftn.ktsnvt.kultura.mapper.*;
import rs.ac.uns.ftn.ktsnvt.kultura.model.CulturalOfferingMainPhoto;
import rs.ac.uns.ftn.ktsnvt.kultura.model.Subcategory;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CulturalOfferingDto {

    private Long id;

    @NotBlank(message = "The name of the cultural offering cannot be blank.")
    private String name;

    private String briefInfo;

    //dodati posle min/max za ovo kad skontamo na osnovu mape koje su te vrednosti koje omogucujemo
    private Float latitude;

    private Float longitude;

    private String address;

    @EntityKey(entityType = CulturalOfferingMainPhoto.class, fieldName = "photo")
    private Long photoId;

    private Float overallRating;

    private Integer numReviews;

    private LocalDateTime lastChange;

    private String additionalInfo;

    @EntityKey(entityType = Subcategory.class, fieldName = "subcategory")
    private Long subcategoryId;

    @EntityField
    private String subcategoryName;

    @EntityField(origin = "subcategory.category.id")
    private long categoryId;

    @EntityField(origin = "subcategory.category.name")
    private String categoryName;

    @Computed(element = "subscribedUsers", functionName = "size")
    private Integer numSubscribed;

    @Computed(element = "culturalOfferingPhotos", functionName = "size")
    private Integer numPhotos;

    @Ignore(ignoreType = IgnoreType.BOTH)
    private Boolean subscribed;
}
