package rs.ac.uns.ftn.ktsnvt.kultura.repository;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import rs.ac.uns.ftn.ktsnvt.kultura.constants.PostConstants;
import rs.ac.uns.ftn.ktsnvt.kultura.constants.SubcategoryConstants;
import rs.ac.uns.ftn.ktsnvt.kultura.model.Post;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource("classpath:test.properties")
public class PostRepositoryIntegrationTest {

    @Autowired
    PostRepository postRepository;

    @Test
    public void findAllByCulturalOfferingIdWhenExist(){
        int numberOfPostsForCulturalOffer = 16;
        Page<Post> postPage = postRepository.findAllByCulturalOfferingId(PostConstants.TEST_CULTURAL_OFFERING_ID, Pageable.unpaged());

        assertEquals(numberOfPostsForCulturalOffer, postPage.getContent().size());

        assertFalse(postPage.get().anyMatch(post ->
                post.getCulturalOffering().getId()!=PostConstants.TEST_CULTURAL_OFFERING_ID));
    }

    @Test
    public void findAllByCulturalOfferingIdWhenNotExist(){
        long nonExistId = -5656L;
        Page<Post> postPage = postRepository.findAllByCulturalOfferingId(nonExistId, Pageable.unpaged());

        assertTrue(postPage.isEmpty());
    }

}
