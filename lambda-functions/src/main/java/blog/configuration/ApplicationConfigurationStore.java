package blog.configuration;
import java.util.HashMap;
import java.util.Map;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;

public class ApplicationConfigurationStore {
    
    private Map<String, ApplicationConfiguration> configurations;
    private static DynamoDBMapper mapper = new DynamoDBMapper(new AmazonDynamoDBClient());
    
    public ApplicationConfigurationStore() {
        configurations = new HashMap<String, ApplicationConfiguration>();
    }
    
    public ApplicationConfiguration getApplicationConfiguration(RequestConfiguration requestConfiguration) {
        String stageName = requestConfiguration.getStageName();
        
        if (configurations.get(stageName) == null) {
            configurations.put(stageName, getApplicationConfigurationFromDynamoDB(stageName));
        }
        return configurations.get(stageName);
    }
    
    private ApplicationConfiguration getApplicationConfigurationFromDynamoDB(String stageName) {
        return mapper.load(ApplicationConfiguration.class, stageName);
    }
}