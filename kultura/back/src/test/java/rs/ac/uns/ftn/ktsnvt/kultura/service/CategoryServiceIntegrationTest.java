package rs.ac.uns.ftn.ktsnvt.kultura.service;

import org.junit.Test;
import org.junit.function.ThrowingRunnable;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import rs.ac.uns.ftn.ktsnvt.kultura.constants.CategoryConstants;
import rs.ac.uns.ftn.ktsnvt.kultura.dto.CategoryDto;
import rs.ac.uns.ftn.ktsnvt.kultura.exception.ResourceExistsException;
import rs.ac.uns.ftn.ktsnvt.kultura.exception.ResourceNotFoundException;
import rs.ac.uns.ftn.ktsnvt.kultura.mapper.Mapper;
import rs.ac.uns.ftn.ktsnvt.kultura.model.Category;
import rs.ac.uns.ftn.ktsnvt.kultura.model.Subcategory;
import rs.ac.uns.ftn.ktsnvt.kultura.repository.CategoryRepository;
import rs.ac.uns.ftn.ktsnvt.kultura.repository.SubcategoryRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.*;
import static rs.ac.uns.ftn.ktsnvt.kultura.constants.CategoryConstants.PAGE_SIZE;

@RunWith(SpringRunner.class)
@Rollback(false)
@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource("classpath:test.properties")
//@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
public class CategoryServiceIntegrationTest {

    @Autowired
    CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private Mapper mapper;

    @Test
    public void testReadAll() {
        Pageable pageRequest = PageRequest.of(0, PAGE_SIZE);

        Page<CategoryDto> returnedCategories = categoryService.readAll(pageRequest);

        assertEquals(CategoryConstants.DB_COUNT, returnedCategories.getContent().size());

    }

    @Test
    public void testReadById(){
        Optional<CategoryDto> cat = categoryService.readById(CategoryConstants.EXISTING_ID1);

        assertEquals(CategoryConstants.EXISTING_ID1, cat.get().getId());
        assertEquals(CategoryConstants.EXISTING_NAME1, cat.get().getName());

    }

    @Test
    public void testReadByIdDoesntExist(){
        Optional<CategoryDto> cat = categoryService.readById(CategoryConstants.NON_EXISTING_ID);
        assertFalse(cat.isPresent());
    }

    @Test
    public void whenCreateThrowEntityExistsException(){
        CategoryDto cat = new CategoryDto();
        cat.setId(CategoryConstants.EXISTING_ID1);
        cat.setName(CategoryConstants.EXISTING_NAME1);

        ThrowingRunnable tr = () -> {
            categoryService.create(cat);
        };

        assertThrows(ResourceExistsException.class, tr);
    }

    @Test(expected = NullPointerException.class)
    public void whenUpdateThrowNullPointerException(){
        CategoryDto cat = new CategoryDto();
        cat.setId(null);

        categoryService.update(cat);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenUpdateResourceNotFoundException(){
        CategoryDto cat = new CategoryDto();
        cat.setId(CategoryConstants.NON_EXISTING_ID);
        cat.setName(CategoryConstants.NON_EXISTING_NAME);

        categoryService.update(cat);
    }

    @Test
    @Transactional
    public void testCreate(){
        CategoryDto cat = new CategoryDto();
        cat.setId(CategoryConstants.TEST_CATEGORY_ID1);
        cat.setName(CategoryConstants.TEST_CATEGORY_NAME1);

        //max value jer uzimamo sve iz baze
        Pageable pageRequest = PageRequest.of(0, Integer.MAX_VALUE);

        int dbSizeBeforeAdd = categoryService.readAll(pageRequest).getContent().size();

        CategoryDto dbCategory = categoryService.create(cat);

        assertThat(dbCategory).isNotNull();

        // Validate if the new category is in the database
        List<CategoryDto> categories = categoryService.readAll(pageRequest).getContent();
        assertThat(categories).hasSize(dbSizeBeforeAdd + 1);

        categoryService.delete(dbCategory.getId());
    }

    @Test
    @Transactional
    //@Rollback(true)
    public void testUpdate() throws Exception {
        CategoryDto oldValues = categoryService.readById(CategoryConstants.EXISTING_ID1).orElseThrow(() -> new Exception("Test invalid!"));
        CategoryDto dbCategory = categoryService.readById(CategoryConstants.EXISTING_ID1).get();

        dbCategory.setName(CategoryConstants.TEST_CATEGORY_NAME1);

        dbCategory = categoryService.update(dbCategory);
        assertThat(dbCategory).isNotNull();

        //verify that database contains updated data
        dbCategory = categoryService.readById(CategoryConstants.EXISTING_ID1).get();
        assertThat(dbCategory.getName()).isEqualTo(CategoryConstants.TEST_CATEGORY_NAME1);

        categoryService.update(oldValues);
    }
    
    @Test
    @Transactional
    public void testDelete() {
        // arrange
        Category newCat = new Category();
        newCat.setName("Kategorija");
        newCat = categoryRepository.save(newCat);
        long idToDelete = newCat.getId();
        long oldSize = categoryRepository.count();

        // act
        categoryService.delete(idToDelete);

        long newSize = categoryRepository.count();

        assertEquals(oldSize - 1, newSize);
    }

    @Test
    public void testDeleteNotFound() {
        // arrange
        long idToDelete = 481;

        // act
        ThrowingRunnable tr = () -> categoryService.delete(idToDelete);

        assertThrows(ResourceNotFoundException.class, tr);
    }

    @Test
    @Transactional
    public void testDeleteHasSubcategories() {
        // arrange
        Category newCat = new Category();
        newCat.setName("Kategorija");
        newCat = categoryRepository.save(newCat);

        Subcategory sc = new Subcategory();
        sc.setName("Potkategorija");
        sc.setCategory(newCat);
        sc = subcategoryRepository.save(sc);
        newCat.getSubcategories().add(sc);
        newCat = categoryRepository.save(newCat);

        long idToDelete = newCat.getId();

        // act
        ThrowingRunnable tr = () -> categoryService.delete(idToDelete);

        assertThrows(ResourceExistsException.class, tr);
    }

}
