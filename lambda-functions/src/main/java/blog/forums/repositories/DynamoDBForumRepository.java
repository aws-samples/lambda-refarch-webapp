package blog.forums.repositories;

import java.util.List;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig.TableNameOverride;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;

import blog.configuration.ApplicationConfiguration;
import blog.forums.models.Forum;

public class DynamoDBForumRepository {


    private DynamoDBMapper mapper;

    public DynamoDBForumRepository(ApplicationConfiguration configuration) {
        mapper = new DynamoDBMapper(new AmazonDynamoDBClient(),
                new DynamoDBMapperConfig(new TableNameOverride(configuration.getForumDynamoDBTableName())));
    }

    public List<Forum> findForums() {
        
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();

        List<Forum> forumList = mapper.scan(Forum.class, scanExpression);
        return forumList;
    }
}